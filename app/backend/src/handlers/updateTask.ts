import { Connection } from '../lib/connection';
import { Exception, HttpStatus } from '../lib/exception';
import { InputTask, Model } from '../lib/model';
import { RequestHandler } from '../lib/types';
import { parseDate } from '../lib/utils';

export function updateTask(con: Connection) {
    return async (args, { req, res, next }) => {

        const body = args.task;
        const task_id = Number.parseInt(args.id, 10);

        const { task, errors } = Model.validateTask(body);
    
        if (errors || !task_id) {
            body.estimated_end_at = parseDate(body.estimated_end_at);
            return new Model([Model.createTask(body)], errors);
        }

        const payload = req.payload;

        await con.query(
            `UPDATE TASK SET
                TASK_TEXT = $1,
                TASK_STATUS = $2,
                ESTIMATED_END_AT = $3,
                FILE_ID = COALESCE($4, FILE_ID)
            WHERE 
                TASK_ID = ${task_id} AND (TASK_ID > 0) AND CREATED_BY = $5`,
            [task.task_text, task.task_status, task.estimated_end_at, task.file_id, payload.user_id]
        );
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
    }
}