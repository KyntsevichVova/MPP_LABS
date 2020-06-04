import { Connection } from '../lib/connection';
import { Exception, HttpStatus } from '../lib/exception';
import { InputTask, Model } from '../lib/model';
import { RequestHandler } from '../lib/types';
import { parseDate } from '../lib/utils';

export function createTask(con: Connection) {
    return async (args, { req, res, next }) => {
        const body = args.task;
        const { task, errors } = Model.validateTask(body);
        
        if (errors) {
            body.estimated_end_at = parseDate(body.estimated_end_at);
            return new Model([Model.createTask(body)], errors);
        }

        const payload = req.payload;

        const result = await con.query(
            `INSERT INTO TASK
                (TASK_TEXT, TASK_STATUS, CREATED_AT, ESTIMATED_END_AT, FILE_ID, CREATED_BY)
            VALUES
                ($1, $2, NOW(), $3, $4, $5)
            RETURNING
                TASK_ID`,
            [task.task_text, task.task_status, task.estimated_end_at, task.file_id, payload.user_id]
        );
        const task_id = result.rows[0].task_id;

        if (task.file_id) {
            await con.query(
                `UPDATE TASK_FILE SET
                    TASK_ID = $1
                WHERE
                    FILE_ID = $2
                AND
                    TASK_ID = -1
                AND
                    CREATED_BY = $3`,
                [task_id, task.file_id, payload.user_id]
            );
        }
        return {};
    }
}