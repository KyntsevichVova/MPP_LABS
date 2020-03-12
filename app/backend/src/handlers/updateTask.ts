import { Connection } from '../lib/connection';
import { Exception, HttpStatus } from '../lib/exception';
import { InputTask, Model } from '../lib/model';
import { RequestHandler } from '../lib/types';
import { parseDate } from '../lib/utils';

export function updateTask(con: Connection): RequestHandler {
    return (req, res, next) => {
        Promise.resolve(req.body as InputTask).then((body) => {
            const task_id = Number.parseInt(req.params.task_id, 10);
            const { task, errors } = Model.validateTask(body);
        
            if (errors || !task_id) {
                body.estimated_end_at = parseDate(body.estimated_end_at);
                res
                    .status(HttpStatus.BAD_REQUEST)
                    .send(new Model([Model.createTask(body)], errors))
                    .end();
                return;
            }

            const payload = req.payload;

            con.query(
                `UPDATE TASK SET
                    TASK_TEXT = $1,
                    TASK_STATUS = $2,
                    ESTIMATED_END_AT = $3,
                    FILE_ID = COALESCE($4, FILE_ID)
                WHERE 
                    TASK_ID = ${task_id} AND (TASK_ID > 0) AND CREATED_BY = $5`,
                [task.task_text, task.task_status, task.estimated_end_at, task.file_id, payload.user_id],
                (error, result) => {
                    if (error) {
                        throw Exception.DatabaseError(error);
                    }
                    if (task.file_id) {
                        con.query(
                            `UPDATE TASK_FILE SET
                                TASK_ID = $1
                            WHERE
                                FILE_ID = $2
                            AND
                                TASK_ID = -1
                            AND
                                CREATED_BY = $3`,
                            [task_id, task.file_id, payload.user_id],
                            (error, result) => {
                                if (error) {
                                    throw Exception.DatabaseError(error);
                                } else {
                                    res.status(HttpStatus.OK).end();
                                }
                            }
                        );
                    } else {
                        res.status(HttpStatus.OK).end();
                    }
                }
            );
        }).catch(next);
    }
}