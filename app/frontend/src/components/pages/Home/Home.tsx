import React from 'react';
import { API } from '../../../lib/api';
import { TASK_ENDPOINT } from '../../../lib/contants';
import Placeholder from '../../Placeholder/Placeholder';
import TaskCard from '../../TaskCard/TaskCard';

function HomePage() {
    const [tasks, setTasks] = React.useState([]);

    React.useEffect(() => {
        API.get(TASK_ENDPOINT).then((res) => {
            res.json().then((data) => {
                setTasks(data.tasks);
            });
        })
    }, []);

    return (
        <div className='container-fluid'>
            <div className='row'>
                {tasks.length ? (
                    <Placeholder />
                ) : (
                    tasks.map((task) => {
                        return (
                            <div className='col-3'>
                                <TaskCard task={task} />
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default HomePage;