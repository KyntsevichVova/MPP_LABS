import React from 'react';
import { API } from '../../../lib/api';
import { STATUS, TASKS_ENDPOINT } from '../../../lib/constants';
import Placeholder from '../../Placeholder/Placeholder';
import TaskCard from '../../TaskCard/TaskCard';
import Filters from '../../Filters/Filters';
import { OutputTask } from '../../../lib/types';
import { useRedirect } from '../../../hooks';
import { Redirect } from 'react-router-dom';

const initialFilters = Object.fromEntries(Object.keys(STATUS).map((status) => [status, true]));

function HomePage() {
    const [tasks, setTasks] = React.useState([] as Array<OutputTask>);
    const [filters, setFilters] = React.useState(initialFilters);
    const { redirect, setShouldRedirect } = useRedirect('/login');

    React.useEffect(() => {
        const searchParams = new URLSearchParams();
        searchParams.append(
            'filter', 
            Object
                .entries(filters)
                .filter(([key, value]) => value)
                .map(([key, value]) => key)
                .join(',')
        );
        API.get(TASKS_ENDPOINT, { searchParams }).then((res) => {
            if (res.status === 200) {
                res.json().then((data) => {
                    setTasks(data.tasks);
                });
            } else if (res.status === 401) {
                setShouldRedirect(true);
            }
        });
    }, [filters]);

    const onSelect = (filter: string, checked: boolean) => {
        setFilters({
            ...filters,
            [filter]: checked
        });
    };

    return (
        <>
            {redirect.should && (<Redirect to={redirect.to} />)}
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