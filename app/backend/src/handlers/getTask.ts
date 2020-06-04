import { Connection } from '../lib/connection';
import { Exception, HttpStatus } from '../lib/exception';
import { Model } from '../lib/model';
import { RequestHandler } from '../lib/types';

export function getTask(con: Connection) {
    return (payload, id) => {
        return new Promise((resolve, reject) => {
            const task_id = Number.parseInt(id, 10);

            if (!task_id) {
                const response = {
                    status: HttpStatus.BAD_REQUEST,
                }
                resolve(response);
                return;
            }
            
            con.query(
                `SELECT * FROM TASK
                WHERE
                    TASK_ID = $1
                AND 
                    TASK_ID > 0
                AND
                    CREATED_BY = $2`,
                [task_id, payload.user_id]
            ).then((result) => {
                if (result.rows.length < 1) {
                    const response = {
                        status: HttpStatus.BAD_REQUEST,
                    }
                    resolve(response);
                    return;
                }

                const response = {
                    status: HttpStatus.OK,
                    data: new Model(result.rows.map(Model.createTask)),
                };
                resolve(response);
            }).catch((error) => {
                reject(Exception.DatabaseError(error));
            });
        });
        /*Promise.resolve().then(() => {
            const task_id = Number.parseInt(req.params.task_id, 10);

            if (!task_id) { 
                throw Exception.BadRequest();
            }

            const payload = req.payload;
            
            con.query(
                `SELECT * FROM TASK
                WHERE
                    TASK_ID = $1
                AND 
                    TASK_ID > 0
                AND
                    CREATED_BY = $2`,
                [task_id, payload.user_id]
            ).then((result) => {
                if (result.rows.length < 1) {
                    throw Exception.EntityNotFound();
                }

                res
                    .status(HttpStatus.OK)
                    .send(new Model(result.rows.map(Model.createTask)))
                    .end();
            }).catch((error) => {
                throw Exception.DatabaseError(error);
            });
        }).catch(next);*/
    }
}
