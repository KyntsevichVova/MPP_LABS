import { STATUS, SUBMIT_TYPE } from '../../lib/constants';
import { Model } from '../../lib/model';
import { RequestHandler } from '../routes';

export function handleAdd(): RequestHandler {
    return (req, res) => {
        res.render('task_form', new Model([{
            task_text: '',
            task_status: STATUS.OPENED.value,
            created_at: '',
            estimated_end_at: ''
        }], 0, SUBMIT_TYPE.ADD));
    }
}