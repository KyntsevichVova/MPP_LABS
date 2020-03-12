import { Connection } from '../lib/connection';
import { Exception, HttpStatus } from '../lib/exception';
import { Model } from '../lib/model';
import { RequestHandler } from '../lib/types';

export function getTask(con: Connection): RequestHandler {
    return (req, res, next) => {
        Promise.resolve().then(() => {
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
                [task_id, payload.user_id],
                (error, result) => {
                    if (error) {
                        throw Exception.DatabaseError(error);
                    }
                    if (result.rows.length < 1) {
                        throw Exception.EntityNotFound();
                    } else {
                        res
                            .status(HttpStatus.OK)
                            .send(new Model(result.rows.map(Model.createTask)))
                            .end();
                    }
                }
            );
        }).catch(next);
    }
}
