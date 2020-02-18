import { STATUS, SUBMIT_ENDPOINT, SUBMIT_TYPE } from '../../lib/constants';
import { RequestHandler } from '../routes';

export function handleAdd(): RequestHandler {
    return (req, res) => {
        res.render('task_form', {
            page: {
                title: 'Add task',
                formAction: `/${SUBMIT_ENDPOINT}?type=${SUBMIT_TYPE.ADD}`
            },
            task: {
                task_text: '',
                task_status: STATUS.OPENED.value,
                created_at: '',
                estimated_end_at: ''
            }
        });
    }
}