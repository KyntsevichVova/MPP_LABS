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

const initialFilters = Object.fromEntries(Object.keys(STATUS).map((status) => [status, true]));

function HomePage() {
    const [tasks, setTasks] = React.useState([] as Array<OutputTask>);
    const [filters, setFilters] = React.useState(initialFilters);
    const { redirect, setShouldRedirect } = useRedirect(LOGIN_ROUTE);

    React.useEffect(() => {
        const filter = Object
                .entries(filters)
                .filter(([key, value]) => value)
                .map(([key, value]) => key)
                .join(',');

        API.post(`/graphql`, {
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: `query GetTasks($filter: String) {
                    getTasks(filter: $filter) {
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
                    }
                }`,
                variables: { filter }
            }),
        }).then((response) => {
            if (response.status === 401) {
                setShouldRedirect(true);
            } else {
                response.json().then((result) => {
                    const data = result.data.getTasks;
                    setTasks(data.tasks);
                });
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