import { Connection } from '../lib/connection';
import { DEFAULT_FILTER } from '../lib/constants';
import { Exception, HttpStatus } from '../lib/exception';
import { Model } from '../lib/model';
import { RequestHandler } from '../lib/types';

export function getTasks(con: Connection) {
    return async (args, { req, res, next }) => {
        const filters = String(args.filter ?? DEFAULT_FILTER)
            .split(',')
            .map((filter) => con.escape(filter.toUpperCase()))
            .join(', ');

        const payload = req.payload;
        
        const result = await con.query(
            `SELECT * FROM TASK
            WHERE
                TASK_ID > 0
            AND
                TASK_STATUS IN (${filters})
            AND
                CREATED_BY = $1
            ORDER BY
                CREATED_AT DESC`,
            [payload.user_id]
        );
        return new Model(result.rows.map(Model.createTask));
    }
}