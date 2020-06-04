import React from 'react';
import { Redirect } from 'react-router-dom';
import { useRedirect } from '../../../hooks';
import { API } from '../../../lib/api';
import { HOME_ROUTE, LOGIN_ROUTE, TASKS_ENDPOINT } from '../../../lib/constants';
import { InputTask } from '../../../lib/types';
import Navbar from '../../Navbar/Navbar';
import TaskForm from '../../TaskForm/TaskForm';
import io from 'socket.io-client';

function AddPage() {
    const { redirect, setShouldRedirect, setToRedirect } = useRedirect(HOME_ROUTE);
    const [task, setTask] = React.useState(undefined);
    const [errors, setErrors] = React.useState({});
    const token = sessionStorage.getItem("token");

    const submitCallback = React.useCallback((task: InputTask) => {
        const data = {
            task_text: task.task_text ?? '',
            task_status: task.task_status ?? 'OPENED',
            estimated_end_at: task.estimated_end_at ?? '',
        };
        const tasksCollection = io(`http://localhost:3000${TASKS_ENDPOINT}`);
        tasksCollection.emit("post", token, data, (response: any) => {
            if (response.status === 201) {
                setShouldRedirect(true);
            } else if (response.status === 401) {
                setToRedirect(LOGIN_ROUTE);
                setShouldRedirect(true);
            } else {
                const result = response.data;
                setTask(result.tasks[0]);
                setErrors(result.errors);
            }
        });
    }, [token]);

    return (
        <>
            {redirect.should && <Redirect to={redirect.to} />}
            <Navbar />
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