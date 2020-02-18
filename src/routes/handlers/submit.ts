import Busboy from 'busboy';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { Connection } from '../../lib/connection';
import { MAX_TASK_TEXT_LENGTH, STATUS, SUBMIT_ENDPOINT, SUBMIT_TYPE, UPLOADS_DIR } from '../../lib/constants';
import { parseDate } from '../../lib/utils';
import { RequestHandler } from '../routes';

export function handleSubmitTask(con: Connection): RequestHandler {
    return (req, res) => {
        const submit_type = req.query.type ? SUBMIT_TYPE[req.query.type.toUpperCase()] : null;

        if (!submit_type) {
            res.redirect('/');
            return;
        }

        const body = {
            task_text: null,
            task_status: null, 
            estimated_end_at: null,
            file_id: null
        };

        const processSubmit = () => {
            const task_text = body.task_text ?? '';
            const task_status = body.task_status ? STATUS[body.task_status]?.value : null;
            const estimated_end_at = parseDate(body.estimated_end_at);
            const file_id = body.file_id;
            const task_id = Number.parseInt(req.query.id, 10);
            
            if (!task_text || task_text.length >= MAX_TASK_TEXT_LENGTH || !task_status || !estimated_end_at) {
                const errors = {
                    text_short: !!(!task_text || task_text.length < 1),
                    text_long: !!(task_text?.length >= MAX_TASK_TEXT_LENGTH),
                    estimated_end_at: !!(estimated_end_at)
                };
                if (submit_type === SUBMIT_TYPE.EDIT) {
                    res.render('task_form', {
                        page: {
                            title: 'Edit task',
                            formAction: `/${SUBMIT_ENDPOINT}?type=${SUBMIT_TYPE.EDIT}&id=${task_id}`
                        },
                        task: body,
                        errors: errors
                    });
                } else {
                    res.render('task_form', {
                        page: {
                            title: 'Add task',
                            formAction: `/${SUBMIT_ENDPOINT}?type=${SUBMIT_TYPE.ADD}`
                        },
                        task: body,
                        errors: errors
                    });
                }
                return;
            }

            if (submit_type === SUBMIT_TYPE.EDIT) {
                if (!task_id) {
                    res.redirect('/');
                    return;
                }
                con.query(
                    `UPDATE TASK SET
                        TASK_TEXT = ${con.escape(task_text)},
                        TASK_STATUS = ${con.escape(task_status)},
                        ESTIMATED_END_AT = ${con.escape(estimated_end_at)},
                        FILE_ID = COALESCE(${file_id}, FILE_ID)
                    WHERE 
                        TASK_ID = ${task_id} AND (TASK_ID > 0)`,
                    (error, result) => {
                        if (error) {
                            //TODO: add rendering with error messages
                            throw error;
                        } else {
                            con.query(
                                `UPDATE TASK_FILE SET
                                    TASK_ID = ${task_id}
                                WHERE
                                    FILE_ID = ${file_id}
                                AND
                                    TASK_ID = -1`,
                                (error, result) => {
                                    if (error) {
                                        //TODO: add rendering with error messages
                                        throw error;
                                    } else {
                                        res.redirect('/');
                                    }
                                }
                            );
                        }
                    }
                );
            } else {
                con.query(
                    `INSERT INTO TASK
                        (TASK_TEXT, TASK_STATUS, CREATED_AT, ESTIMATED_END_AT, FILE_ID)
                    VALUES
                        (${con.escape(task_text)}, ${con.escape(task_status)}, CURRENT_DATE, ${con.escape(estimated_end_at)}, ${file_id})
                    RETURNING
                        TASK_ID`,
                    (error, result) => {
                        if (error || result.rows.length < 1) {
                            //TODO: add rendering with error messages
                            throw error;
                        } else {
                            const task_id = result.rows[0].task_id;
                            con.query(
                                `UPDATE TASK_FILE SET
                                    TASK_ID = ${task_id}
                                WHERE
                                    FILE_ID = ${file_id}
                                AND
                                    TASK_ID = -1`,
                                (error, result) => {
                                    if (error) {
                                        //TODO: add rendering with error messages
                                        throw error;
                                    } else {
                                        res.redirect('/');
                                    }
                                }
                            );
                        }
                    }
                );
            }
        }

        const busboy = new Busboy({
            headers: req.headers,
            limits: {
                files: 1
            }
        });

        busboy.on('file', (fieldname, file, filename) => {
            if (filename.length === 0) {
                file.resume();
                return;
            }
            con.query(
                `INSERT INTO TASK_FILE
                    (TASK_ID, FILE_NAME)
                VALUES
                    (-1, ${con.escape(filename)})
                RETURNING
                    file_id`,
                (error, result) => {
                    if (error) {
                        throw error;
                    } else {
                        body.file_id = result.rows[0].file_id;
                        const saveTo = join(process.cwd(), UPLOADS_DIR, `${body.file_id}`);
                        file.pipe(createWriteStream(saveTo));
                    }
                }
            );
        });

        busboy.on('field', (fieldname, val) => {
            body[fieldname] = val;
        });

        busboy.on('finish', () => {
            processSubmit();
        });

        req.pipe(busboy);
    }
}
