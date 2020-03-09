import { Connection } from '../lib/connection';
import { Exception, HttpStatus } from '../lib/exception';
import { Model } from '../lib/model';
import { RequestHandler } from '../lib/types';

export function getTask(con: Connection): RequestHandler {
    return (req, res, next) => {
        Promise.resolve().then(() => {
            const task_id = Number.parseInt(req.params.task_id, 10);

            if (!task_id) { 
                throw Exception.BAD_REQUEST;
            }
            
            con.query(
                `SELECT * FROM TASK
                WHERE
                    (TASK_ID = '${task_id}')
                AND 
                    (TASK_ID > 0)`,
                (error, result) => {
                    if (error) {
                        throw Exception.DATABASE_ERROR;
                    }
                    if (result.rows.length < 1) {
                        throw Exception.ENTITY_NOT_FOUND;
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
