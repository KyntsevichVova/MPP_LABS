import React from 'react';
import Placeholder from '../../Placeholder/Placeholder';
import TaskCard from '../../TaskCard/TaskCard';

function HomePage() {
    const [tasks, setTasks] = React.useState([]);
    return (
        <div className="container-fluid">
            <div className="row">
                {tasks.length ? (
                    <Placeholder />
                ) : (
                    tasks.map((task) => {
                        return (
                            <div className="col-3">
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