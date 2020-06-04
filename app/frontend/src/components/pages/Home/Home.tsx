import React from 'react';
import { Redirect } from 'react-router-dom';
import { useRedirect } from '../../../hooks';
import { API } from '../../../lib/api';
import { LOGIN_ROUTE, STATUS, TASKS_ENDPOINT } from '../../../lib/constants';
import { OutputTask } from '../../../lib/types';
import Filters from '../../Filters/Filters';
import Navbar from '../../Navbar/Navbar';
import Placeholder from '../../Placeholder/Placeholder';
import TaskCard from '../../TaskCard/TaskCard';
import io from 'socket.io-client';

const initialFilters = Object.fromEntries(Object.keys(STATUS).map((status) => [status, true]));

function HomePage() {
    const [tasks, setTasks] = React.useState([] as Array<OutputTask>);
    const [filters, setFilters] = React.useState(initialFilters);
    const { redirect, setShouldRedirect } = useRedirect(LOGIN_ROUTE);
    const token = sessionStorage.getItem("token");

    React.useEffect(() => {
        const filter = Object
                .entries(filters)
                .filter(([key, value]) => value)
                .map(([key, value]) => key)
                .join(',');
        const tasksCollection = io(`http://localhost:3000${TASKS_ENDPOINT}`);
        tasksCollection.emit("get", token, filter, (response: any) => {
            if (response.status === 200) {
                setTasks(response.data.tasks);
            } else if (response.status === 401) {
                setShouldRedirect(true);
            }
        });
    }, [filters, token]);

    const onSelect = (filter: string, checked: boolean) => {
        setFilters({
            ...filters,
            [filter]: checked
        });
    };

    return (
        <>
            {redirect.should && (<Redirect to={redirect.to} />)}
            <Navbar />
            {!tasks.length ? (
                <Placeholder />
            ) : (
                <div className='container-fluid'>
                    <div className='row'>
                        <Filters
                            filters={filters}
                            onSelect={onSelect}
                        />
                    </div>
                    <div className='row'>
                        {tasks.map((task) => {
                            return (
                                <div className='col-3'>
                                    <TaskCard task={task} key={task.task_id}/>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </>
    );
}

export default HomePage;