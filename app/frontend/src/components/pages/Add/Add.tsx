import React from 'react';
import { Redirect } from 'react-router-dom';
import { useRedirect } from '../../../hooks';
import { API } from '../../../lib/api';
import { TASKS_ENDPOINT } from '../../../lib/constants';
import { InputTask } from '../../../lib/types';
import TaskForm from '../../TaskForm/TaskForm';

function AddPage() {
    const { redirect, setShouldRedirect, setToRedirect } = useRedirect('/');
    const [task, setTask] = React.useState(undefined);
    const [errors, setErrors] = React.useState({});

    const submitCallback = React.useCallback((task: InputTask) => {
        const data = new FormData();
        data.append('task_text', task.task_text ?? '');
        data.append('task_status', task.task_status ?? 'OPENED');
        data.append('estimated_end_at', task.estimated_end_at ?? '');
        if (task.att_file)
            data.append('att_file', task.att_file);

        API.post(`${TASKS_ENDPOINT}`, {
            body: data
        }).then((response) => {
            if (response.status === 201) {
                setShouldRedirect(true);
            } else if (response.status === 401) {
                setToRedirect('/auth/login');
                setShouldRedirect(true);
            } else {
                response.json().then((result) => {
                    setTask(result.tasks[0]);
                    setErrors(result.errors);
                });
            }
        });
    }, []);

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

export default AddPage;