import Busboy from 'busboy';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { Connection } from '../../lib/connection';
import { ADD_ENDPOINT, MAX_TASK_TEXT_LENGTH, STATUS, SUBMIT_ENDPOINT, SUBMIT_TYPE, UPLOADS_DIR } from '../../lib/constants';
import { parseDate } from '../../lib/utils';
import { RequestHandler } from '../routes';

interface Task {
    task_text?: string,
    task_status?: string,
    estimated_end_at?: string,
    file_id?: string
}

interface ValidationError {
    text_short?: boolean,
    text_long?: boolean,
    estimated_end_at?: boolean,
    status_present?: boolean
}

interface ValidatedTask {
    task: Task,
    errors: ValidationError | undefined
}

function validate(body: Task): ValidatedTask {
    const task: Task = {
        task_text: body.task_text ?? '',
        task_status: body.task_status ? STATUS[body.task_status]?.value : null,
        estimated_end_at: parseDate(body.estimated_end_at),
        file_id: body.file_id
    };
    const errors = {
        text_short: !task.task_text || task.task_text.length < 1,
        text_long: task.task_text?.length >= MAX_TASK_TEXT_LENGTH,
        estimated_end_at: !task.estimated_end_at,
        status_present: !task.task_status
    };
    const errorPresent = errors.text_short || errors.text_long || errors.estimated_end_at || errors.status_present;
    return {
        task,
        errors: errorPresent ? errors : undefined
    };
}

export function handleSubmitTask(con: Connection): RequestHandler {
    return (req, res) => {
        const submit_type = req.query.type ? SUBMIT_TYPE[req.query.type.toUpperCase()] : null;

        if (!submit_type) {
            res.redirect('/');
            return;
        }

        const processSubmit = (body: Task) => {
            const { task, errors } = validate(body);
            const task_id = Number.parseInt(req.query.task_id, 10);
            
            if (errors) {
                res.render('task_form', {
                    page: {
                        title: `${(submit_type === SUBMIT_TYPE.EDIT) ? 'Edit' : 'Add'} task`,
                        formAction: `/${SUBMIT_ENDPOINT}?type=${submit_type}&task_id=${task_id}`
                    },
                    task: body,
                    errors,
                    ADD_ENDPOINT: ADD_ENDPOINT
                });
                return;
            }

            if (submit_type === SUBMIT_TYPE.EDIT) {
                if (!task_id) {
                    res.redirect('/');
                    return;
                }
                con.query(
                    `UPDATE TASK SET
                        TASK_TEXT = $1,
                        TASK_STATUS = $2,
                        ESTIMATED_END_AT = $3,
                        FILE_ID = COALESCE($4, FILE_ID)
                    WHERE 
                        TASK_ID = ${task_id} AND (TASK_ID > 0)`,
                    [task.task_text, task.task_status, task.estimated_end_at, task.file_id],
                    (error, result) => {
                        if (error) {
                            //TODO: add rendering with error messages
                            throw error;
                        } else {
                            con.query(
                                `UPDATE TASK_FILE SET
                                    TASK_ID = $1
                                WHERE
                                    FILE_ID = $2
                                AND
                                    TASK_ID = -1`,
                                [task_id, task.file_id],
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
                        ($1, $2, CURRENT_DATE, $3, $4)
                    RETURNING
                        TASK_ID`,
                    [task.task_text, task.task_status, task.estimated_end_at, task.file_id],
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
                                    FILE_ID = $1
                                AND
                                    TASK_ID = -1`,
                                [task.file_id],
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

        const fields: Array<Promise<any>> = [];

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

            fields.push(new Promise((resolve, reject) => {
                con.query(
                    `INSERT INTO TASK_FILE
                        (TASK_ID, FILE_NAME)
                    VALUES
                        (-1, $1)
                    RETURNING
                        file_id`,
                    [filename],
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            const file_id = result.rows[0].file_id;
                            const saveTo = join(process.cwd(), UPLOADS_DIR, `${file_id}`);
                            file.pipe(createWriteStream(saveTo));
                            resolve({ file_id: file_id });
                        }
                    }
                );
            }));
        });

        busboy.on('field', (fieldname, val) => {
            fields.push(new Promise((resolve) => {
                resolve({ [fieldname]: val });
            }));
        });

        busboy.on('finish', () => {
            Promise.all(fields).then((value) => {
                let body = {};
                value.forEach((field) => {
                    body = {
                        ...body,
                        ...field
                    };
                });
                processSubmit(body);
            }).catch((reason) => {
                console.log(reason);
            });
        });

        req.pipe(busboy);
    }
}
