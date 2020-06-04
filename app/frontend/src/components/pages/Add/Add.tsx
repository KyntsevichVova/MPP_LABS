import React from 'react';
import { Redirect } from 'react-router-dom';
import { useRedirect } from '../../../hooks';
import { API } from '../../../lib/api';
import { HOME_ROUTE, LOGIN_ROUTE, TASKS_ENDPOINT } from '../../../lib/constants';
import { InputTask } from '../../../lib/types';
import Navbar from '../../Navbar/Navbar';
import TaskForm from '../../TaskForm/TaskForm';

function AddPage() {
    const { redirect, setShouldRedirect, setToRedirect } = useRedirect(HOME_ROUTE);
    const [task, setTask] = React.useState(undefined);
    const [errors, setErrors] = React.useState({});

    const submitCallback = React.useCallback((task: InputTask) => {
        const data = new FormData();
        data.append('task_text', task.task_text ?? '');
        data.append('task_status', task.task_status ?? 'OPENED');
        data.append('estimated_end_at', task.estimated_end_at ?? '');
        if (task.att_file)
            data.append('att_file', task.att_file);

        API.post(`/form`, {
            body: data,
            credentials: 'same-origin'
        }).then((response) => {
            if (response.status === 401) {
                setToRedirect(LOGIN_ROUTE);
                setShouldRedirect(true);
            } else {
                response.json().then((body) => {
                    task.file_id = body.file_id;
                    API.post(`/graphql`, {
                        credentials: 'same-origin',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                        body: JSON.stringify({
                            query: `mutation AddTask($task: InputTask!) {
                                createTask(task: $task) {
                                    tasks {
                                        task_id
                                        task_text
                                        estimated_end_at
                                        file_id
                                        deadline
                                        task_status {
                                            text
                                            value
                                        }                          
                                    }
                                    errors {
                                        text_short
                                        text_long
                                        estimated_end_at
                                        status_present                            
                                    }
                                }
                            }`,
                            variables: { task }
                        }),
                    }).then((response) => {
                        response.json().then((result) => {
                            const data = result.data.createTask;
                            if (!data?.errors) {
                                setShouldRedirect(true);
                            } else {
                                setTask(data.tasks[0]);
                                setErrors(data.errors);            
                            }
                        });
                    });
                });
            }
        });
    }, []);

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