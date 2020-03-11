import React from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { useRedirect } from '../../../hooks';
import { API } from '../../../lib/api';
import { TASKS_ENDPOINT } from '../../../lib/constants';
import { InputTask } from '../../../lib/types';
import TaskForm from '../../TaskForm/TaskForm';

function EditPage() {
    const { task_id } = useParams();
    const { redirect, setShouldRedirect } = useRedirect('/');
    const [task, setTask] = React.useState(undefined as any);
    const [errors, setErrors] = React.useState({});

    React.useEffect(() => {
        API.get(`${TASKS_ENDPOINT}/${task_id}`).then((res) => {
            res.json().then((data) => {
                setTask(data.tasks[0]);
            });
        });
    }, [task_id]);

    const submitCallback = React.useCallback((task: InputTask) => {
        const data = new FormData();
        data.append('task_text', task.task_text ?? '');
        data.append('task_status', task.task_status ?? 'OPENED');
        data.append('estimated_end_at', task.estimated_end_at ?? '');
        if (task.att_file)
            data.append('att_file', task.att_file);

        API.post(`${TASKS_ENDPOINT}/${task_id}`, {
            body: data
        }).then((response) => {
            if (response.status === 200) {
                setShouldRedirect(true);
            } else {
                response.json().then((result) => {
                    setTask(result.tasks[0]);
                    setErrors(result.errors);
                });
            }
        });
    }, [task_id]);

    return (
        <>
            {redirect.should && <Redirect to={redirect.to} />}
            <div className='container'>
                <div className='my-3'>
                    <TaskForm
                        task={task}
                        errors={errors}
                        submitCallback={submitCallback}
                    />
                </div>
            </div>
        </>
    );

}

export default EditPage;