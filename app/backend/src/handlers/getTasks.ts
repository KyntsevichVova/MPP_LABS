import { Connection } from '../lib/connection';
import { DEFAULT_FILTER } from '../lib/constants';
import { Model } from '../lib/model';
import { RequestHandler } from '../lib/types';
import { ExceptionType, HttpStatus, Exception } from '../lib/exception';

export function getTasks(con: Connection): RequestHandler {
    return (req, res, next) => {
        Promise.resolve().then(() => {
            const filters = String(req.query.filter ?? DEFAULT_FILTER)
                .split(',')
                .map((filter) => con.escape(filter.toUpperCase()))
                .join(', ');
            
            con.query(
                `SELECT * FROM TASK
                WHERE
                    (TASK_ID > 0)
                AND
                    (TASK_STATUS IN (${filters}))
                ORDER BY 
                    CREATED_AT DESC`,
                (error, result) => {
                    if (error) {
                        throw Exception.DatabaseError(error);
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