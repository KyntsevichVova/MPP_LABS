import { Connection } from '../lib/connection';
import { Exception, HttpStatus } from '../lib/exception';
import { Model } from '../lib/model';
import { RequestHandler } from '../lib/types';

export function getTask(con: Connection) {
    return async (args, { req, res, next }) => {
        const task_id = Number.parseInt(args.id, 10);

        if (!task_id) { 
            next(Exception.BadRequest());
            return;
        }

        const payload = req.payload;
        
        const result = await con.query(
            `SELECT * FROM TASK
            WHERE
                TASK_ID = $1
            AND 
                TASK_ID > 0
            AND
                CREATED_BY = $2`,
            [task_id, payload.user_id]
        );
        
        if (result.rows.length < 1) {
            next(Exception.EntityNotFound());
            return;
        }

        return new Model(result.rows.map(Model.createTask));
    }
}
