import { Connection } from '../../lib/connection';
import { SUBMIT_TYPE } from '../../lib/constants';
import { Model } from '../../lib/model';
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
                        res.render('task_form', new Model(result.rows.map(Model.createTask), task_id, SUBMIT_TYPE.EDIT));
                    }
                }
            );
        }
    }
}
