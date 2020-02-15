import Busboy from 'busboy';
import { Request, Response } from 'express';
import { createWriteStream, existsSync } from 'fs';
import { basename, extname,join, normalize } from 'path';
import { Connection } from '../lib/connection';
import { STATUS, UPLOADS_DIR } from '../lib/constants';
import { parseDate } from '../lib/utils';

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
                    (TASK_ID = '${task_id}')`, 
                (error, result) => {
                    if (error || result.rows.length <= 0) {
                        res.redirect('/');
                    } else {
                        res.render('edit', {
                            task: result.rows[0]
                        });
                    }
                }
            );
        }
    }
}

export function handleIndex(con: Connection): RequestHandler {
    return (req, res) => {
        con.query(
            'SELECT * FROM TASK', 
            (error, result) => {
                if (error) {
                    //TODO: add rendering with error messages
                    throw error;
                } else {
                    res.render('index', {
                        tasks: result.rows
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
                        FILE_ID = COALESCE(FILE_ID, ${file_id})
                    WHERE 
                        TASK_ID = ${task_id}`,
                    (error, result) => {
                        if (error) {
                            //TODO: add rendering with error messages
                            throw error;
                        } else {
                            res.redirect(`/task?id=${task_id}`);
                        }
                    }
                );
            } else {
                con.query(
                    `INSERT INTO TASK
                        (TASK_TEXT, TASK_STATUS, CREATED_AT, ESTIMATED_END_AT, FILE_ID)
                    VALUES
                        (${task_text}, ${status}, CURRENT_DATE, ${end_at}, ${file_id})`,
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

        const busboy = new Busboy({
            headers: req.headers,
            limits: {
                files: 1
            }
        });

        busboy.on('file', (fieldname, file, filename) => {
            filename = con.escape(filename);
            con.query(
                `INSERT INTO TASK_FILE
                    (TASK_ID, FILE_NAME)
                VALUES
                    (-1, ${filename})
                RETURNING
                    file_id`,
                (error, result) => {
                    if (error) {
                        throw error;
                    } else {
                        body.file_id = result.rows[0].id;
                        let ext = extname(filename);
                        ext = ext ? `.${ext}` : '';
                        const saveTo = join(process.cwd(), UPLOADS_DIR, `${body.file_id}${ext}`);
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

export function handleDownload(): RequestHandler {
    return (req, res) => {
        let filename = req.query.filename;
        if (!filename) {
            res.status(404).end();
        } else {
            filename = join(process.cwd(), UPLOADS_DIR, basename(normalize(filename)));
            if (existsSync(filename)) {
                res.download(filename);
            } else {
                res.status(404).end();
            }
        }
    }
}