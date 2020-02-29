import { SUBMIT_TYPE } from '../../lib/constants';
import { Model } from '../../lib/model';
import { RequestHandler } from '../../lib/types';

export function handleAdd(): RequestHandler {
    return (req, res) => {
        res.render('task_form', new Model(
            [Model.createTask()],
            0,
            SUBMIT_TYPE.ADD
        ));
    }
}