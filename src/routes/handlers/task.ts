import { Connection } from '../../lib/connection';
import { RequestHandler } from '../../lib/types';
import { handleAdd } from './add';
import { handleEdit } from './edit';

export function handleTask(con: Connection): RequestHandler {
    return (req, res) => {
        const task_id = Number.parseInt(req.query.task_id, 10);
        
        if (!task_id) {
            handleAdd()(req, res);
        } else {
            handleEdit(con)(req, res);
        }
    }
}
