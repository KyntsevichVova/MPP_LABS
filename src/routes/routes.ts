import Busboy from 'busboy';
import { Request, Response } from 'express';
import { createWriteStream, existsSync } from 'fs';
import { basename, join, normalize } from 'path';
import { Connection } from '../lib/connection';
import { STATUS, UPLOADS_DIR } from '../lib/constants';
import { parseDate, printDate } from '../lib/utils';

type RequestHandler = (req: Request, res: Response) => void;

export function handleEdit(con: Connection): RequestHandler {
    return (req, res) => {
        const task_id = Number.parseInt(req.query.id, 10);
        if (!task_id) {
            res.redirect('/');
        } else {
            con.query(
                `SELECT * FROM TASK
                WHERE
                    (TASK_ID = '${task_id}')
                AND 
                    (TASK_ID > 0)`,
                (error, result) => {
                    if (error || result.rows.length < 1) {
                        res.redirect('/');
                    } else {
                        const row = result.rows[0];
                        res.render('edit', {
                            task: {
                                task_id: row.task_id,
                                task_text: row.task_text,
                                task_status: row.task_status,
                                created_at: row.created_at,
                                estimated_end_at: printDate(new Date(row.estimated_end_at))
                            }
                        });
                    }
                }
            );
        }
    }
}

export function handleIndex(con: Connection): RequestHandler {
    return (req, res) => {
        const filter = req.query.filter ? con.escape(req.query.filter) : null;
        con.query(
            `SELECT * FROM TASK
            WHERE
                (TASK_ID > 0)
            AND
                (TASK_STATUS LIKE COALESCE(${filter}, '%'))`, 
            (error, result) => {
                if (error || result.rows.length < 1) {
                    res.render('index', {
                        tasks: []
                    });
                } else {
                    let tasks: Array<any> = result.rows.map((value) => {
                        return {
                            task_id: value.task_id,
                            task_text: value.task_text,
                            task_status: STATUS[value.task_status].text,
                            created_at: value.created_at,
                            estimated_end_at: printDate(new Date(value.estimated_end_at)),
                            dl: (new Date() >= new Date(value.estimated_end_at)),
                            file_id: value.file_id
                        }
                    });
                    res.render('index', {
                        tasks: tasks
                    });
                }
            }
        );
    }
}

export function handleAdd(): RequestHandler {
    return (req, res) => {
        res.render('add');
    }
}

export function handleSubmitTask(con: Connection): RequestHandler {
    return (req, res) => {
        const body = {
            task_text: null,
            status: null, 
            end_at: null,
            file_id: null
        };

        const processSubmit = () => {
            const task_text = con.escape(body.task_text ?? '');
            const status = body.status ? con.escape(STATUS[body.status]?.value) : null;
            const end_at = con.escape(parseDate(body.end_at));
            const file_id = body.file_id;
            
            if (!task_text || !status || !end_at) {
                //TODO: add rendering with error messages
                throw new Error();
            }

            if (req.query.id) {
                const task_id = Number.parseInt(req.query.id, 10);
                if (!task_id) {
                    //TODO: add rendering with error messages
                    throw new Error();
                }
                con.query(
                    `UPDATE TASK SET
                        TASK_TEXT = ${task_text},
                        TASK_STATUS = ${status},
                        ESTIMATED_END_AT = ${end_at}
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
                        (${task_text}, ${status}, CURRENT_DATE, ${end_at}, ${file_id})
                    RETURNING
                        TASK_ID`,
                    (error, result) => {
                        if (error) {
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

export function handleDownload(con: Connection): RequestHandler {
    return (req, res) => {
        const file_id = Number.parseInt(req.query.file_id);
        if (!file_id) {
            res.status(404).end();
        } else {
            const filename = join(process.cwd(), UPLOADS_DIR, basename(normalize(String(file_id))));
            if (existsSync(filename)) {
                con.query(
                    `SELECT FILE_NAME FROM TASK_FILE
                    WHERE
                        FILE_ID = ${file_id}`, 
                    (error, result) => {
                        if (error || result.rows.length < 1) {
                            res.status(404).end();
                        } else {
                            res.download(filename, result.rows[0].file_name);
                        }
                    }
                );
            } else {
                res.status(404).end();
            }
        }
    }
}