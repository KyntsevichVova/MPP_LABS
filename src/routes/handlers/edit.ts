import { Connection } from '../../lib/connection';
import { ADD_ENDPOINT, EDIT_ENDPOINT } from '../../lib/constants';
import { printDate } from '../../lib/utils';
import { RequestHandler } from '../routes';

export function handleEdit(con: Connection): RequestHandler {
    return (req, res) => {
        const task_id = Number.parseInt(req.query.task_id, 10);
        
        if (!task_id) {
            res.redirect('/');
        } else {
            con.query(
                `SELECT * FROM TASK
                WHERE
                    (TASK_ID = '${task_id}')
                AND 
                    (TASK_ID > 0)`,
                (error, result) => {
                    if (error || result.rows.length < 1) {
                        res.redirect('/');
                    } else {
                        const row = result.rows[0];
                        res.render('task_form', {
                            page: {
                                title: 'Edit task',
                                formAction: `${EDIT_ENDPOINT}&task_id=${row.task_id}`
                            },
                            task: {
                                task_text: row.task_text,
                                task_status: row.task_status,
                                created_at: row.created_at,
                                estimated_end_at: printDate(new Date(row.estimated_end_at))
                            },
                            ADD_ENDPOINT: ADD_ENDPOINT
                        });
                    }
                }
            );
        }
    }
}
