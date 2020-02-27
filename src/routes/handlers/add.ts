import { ADD_ENDPOINT, STATUS } from '../../lib/constants';
import { RequestHandler } from '../routes';

export function handleAdd(): RequestHandler {
    return (req, res) => {
        res.render('task_form', {
            page: {
                title: 'Add task',
                formAction: `${ADD_ENDPOINT}&task_id=0`
            },
            task: {
                task_text: '',
                task_status: STATUS.OPENED.value,
                created_at: '',
                estimated_end_at: ''
            },
            ADD_ENDPOINT: ADD_ENDPOINT
        });
    }
}