import { Connection } from '../lib/connection';
import { DEFAULT_FILTER } from '../lib/constants';
import { Exception, HttpStatus } from '../lib/exception';
import { Model } from '../lib/model';
import { RequestHandler } from '../lib/types';

export function getTasks(con: Connection): RequestHandler {
    return (req, res, next) => {
        Promise.resolve().then(() => {
            const filters = String(req.query.filter ?? DEFAULT_FILTER)
                .split(',')
                .map((filter) => con.escape(filter.toUpperCase()))
                .join(', ');

            const payload = req.payload;
            
            con.query(
                `SELECT * FROM TASK
                WHERE
                    TASK_ID > 0
                AND
                    TASK_STATUS IN (${filters})
                AND
                    CREATED_BY = $1
                ORDER BY 
                    CREATED_AT DESC`,
                [payload.user_id],
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