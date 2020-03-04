import React from 'react';
import { Link } from 'react-router-dom';
import { DOWNLOAD_ENDPOINT, EDIT_ENDPOINT } from '../../lib/contants';
import { OutputTask } from '../../lib/types';

interface TaskCardProps {
    task: OutputTask;
}

function TaskCard({
    task
}: TaskCardProps) {
    const {
        task_id,
        task_status,
        task_text,
        estimated_end_at,
        file_id,
        deadline
    } = task;
    return (
        <div className='card my-3 bg-light'>
            <div className='card-header'>
                Task
            </div>
            <div className='card-body'>
                <h6 className='card-subtitle'>
                    Status: {task_status?.text}
                </h6>
                
                <h6 className={`card-subtitle my-2 ${deadline ? 'text-danger' : '' }`}>
                    End at: {estimated_end_at}
                </h6>
                
                <p className='card-text my-3'>
                    {task_text}
                </p>
                
                <Link
                    to={`${EDIT_ENDPOINT}/${task_id}`}
                    className='btn btn-primary mr-1'
                >
                    Edit
                </Link>

                {!!file_id && (
                    <Link
                        to={`${DOWNLOAD_ENDPOINT}?file_id${file_id}`}
                        className='btn btn-primary ml-1'
                        download
                    >
                        Attachment
                    </Link>
                )}
            </div>
        </div>
    );
}

export default TaskCard;