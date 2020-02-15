import { Request, Response } from 'express';
import { Connection } from '../lib/connection';
import { STATUS } from '../lib/constants';
import { parseDate } from '../lib/utils';

type RequestHandler = (req: Request, res: Response) => void;

export function handleEdit(con: Connection): RequestHandler {
    return (req, res) => {
        const task_id = Number.parseInt(req.query.id, 10);
        if (!task_id) {
            res.redirect('/');
        } else {
            con.query(`SELECT * FROM TASK WHERE (TASK_ID = '${task_id}')`, (error, result) => {
                if (error || result.length <= 0) {
                    res.redirect('/');
                } else {
                    res.render('edit', {
                        task: result[0]
                    });
                }
            });
        }
    }
}

export function handleIndex(con: Connection): RequestHandler {
    return (req, res) => {
        con.query('SELECT * FROM TASK', (error, result) => {
            if (error) {
                //TODO: add rendering with error messages
                throw error;
            } else {
                console.log(result.rows);
                res.render('index', {
                    tasks: result.rows
                });
            }
        });
    }
}

export function handleAdd(): RequestHandler {
    return (req, res) => {
        res.render('add');
    }
}

export function handleSubmitTask(con: Connection): RequestHandler {
    return (req, res) => {
        const task_text = con.escape(req.body.task_text ?? '');
        const status = req.body.status ? con.escape(STATUS[req.body.status]?.value) : null;
        const end_at = con.escape(parseDate(req.body.end_at));
        
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
                `UPDATE TASK SET TASK_TEXT = ${task_text}, TASK_STATUS = ${status}, ESTIMATED_END_AT = ${end_at} WHERE TASK_ID = ${task_id}`, 
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
                `INSERT INTO TASK (TASK_TEXT, TASK_STATUS, CREATED_AT, ESTIMATED_END_AT) VALUES (${task_text}, ${status}, CURRENT_DATE, ${end_at})`, 
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
}