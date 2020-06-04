import React from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { useRedirect } from '../../../hooks';
import { API } from '../../../lib/api';
import { HOME_ROUTE, TASKS_ENDPOINT, LOGIN_ROUTE } from '../../../lib/constants';
import { InputTask } from '../../../lib/types';
import Navbar from '../../Navbar/Navbar';
import TaskForm from '../../TaskForm/TaskForm';
import io from 'socket.io-client';

function EditPage() {
    const { task_id } = useParams();
    const { redirect, setShouldRedirect, setToRedirect } = useRedirect(HOME_ROUTE);
    const [task, setTask] = React.useState(undefined as any);
    const [errors, setErrors] = React.useState({});
    const token = sessionStorage.getItem("token");

    React.useEffect(() => {
        const taskSocket = io(`http://localhost:3000${TASKS_ENDPOINT}/id`);
        taskSocket.emit("get", token, task_id, (response: any) => {
            setTask(response.data.tasks[0]);
        });
    }, [task_id, token]);

    const submitCallback = React.useCallback((task: InputTask) => {
        const data = {
            task_text: task.task_text ?? '',
            task_status: task.task_status ?? 'OPENED',
            estimated_end_at: task.estimated_end_at ?? '',
        };
        const taskSocket = io(`http://localhost:3000${TASKS_ENDPOINT}/id`);
        taskSocket.emit("post", token, task_id, data, (response: any) => {
            if (response.status === 200) {
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
    }, [task_id, token]);

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

export default EditPage;