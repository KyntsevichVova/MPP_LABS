import { Connection } from '../../lib/connection';
import { DEFAULT_FILTER, STATUS } from '../../lib/constants';
import { printDate } from '../../lib/utils';
import { RequestHandler } from '../routes';

export function handleIndex(con: Connection): RequestHandler {
    return (req, res) => {
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
                if (error || result.rows.length < 1) {
                    res.render('index', {
                        tasks: []
                    });
                } else {
                    let tasks: Array<any> = result.rows.map((value) => {
                        return {
                            task_id: value.task_id,
                            task_text: value.task_text,
                            task_status: STATUS[value.task_status].text,
                            created_at: value.created_at,
                            estimated_end_at: printDate(new Date(value.estimated_end_at)),
                            dl: (new Date() >= new Date(value.estimated_end_at)),
                            file_id: value.file_id
                        }
                    });
                    res.render('index', {
                        tasks: tasks
                    });
                }
            }
        );
    }
}