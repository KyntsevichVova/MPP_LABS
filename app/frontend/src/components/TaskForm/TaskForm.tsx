import React from 'react';
import { Errors, Task } from '../../lib/types';

interface TaskFormProps {
    task: Task;
    errors: Errors;
}

function TaskForm({
    task, errors
}: TaskFormProps) {
    return (
        <form method='POST' action='' encType='multipart/form-data'>
            <div className='form-group'>
                <label htmlFor='task'>Task:</label>
                <textarea 
                    className={`form-control ${(errors && (errors.text_long || errors.text_short)) ? 'is-invalid' : ''}`} 
                    id='task' 
                    maxLength={255}
                    name='task_text'
                    value={task.task_text}
                />
                {(errors && (errors.text_long || errors.text_short)) && ( 
                    <small className='text-danger'>
                        {(errors.text_long) && (
                            'Task cannot exceed 250 characters.'
                        )}

                        {(errors.text_short) && (
                            'Task cannot be empty.'
                        )}
                    </small>
                )}
            </div>
            
            <div className='form-group'>
                <div className='form-check'>
                    <input className='form-check-input' type='radio' name='task_status' value='OPENED' id='r_OPENED'
                        checked={task?.task_status?.value === 'OPENED'}
                    />
                    <label className='form-check-label' htmlFor='r_OPENED'>Opened</label>
                </div>

                <div className='form-check'>
                    <input className='form-check-input' type='radio' name='task_status' value='INPROGRESS' id='r_INPROGRESS'
                        checked={task?.task_status?.value === 'INPROGRESS'}
                    />
                    <label className='form-check-label' htmlFor='r_INPROGRESS'>In progress</label>
                </div>
                
                <div className='form-check'>
                    <input className='form-check-input' type='radio' name='task_status' value='CLOSED' id='r_CLOSED'
                        checked={task?.task_status?.value === 'CLOSED'}
                    />
                    <label className='form-check-label' htmlFor='r_CLOSED'>Closed</label>
                </div>
            </div> 

            <div className='form-group'>
                <label htmlFor='estimated_end_at'>Estimated end:</label>
                <input className='form-control' type='text' name='estimated_end_at' value={`${ task.estimated_end_at }`} id='estimated_end_at'/>
                {(errors && errors.estimated_end_at) && (
                    <small className='text-danger'>
                        Should be a date in 'DD.MM.YYYY' format.
                    </small>
                )}  
            </div>
            
            <div className='form-group'>
                <label htmlFor='att_file'>Attachment:</label>
                <input className='form-control-file' type='file' name='att_file' id='att_file' />
            </div>

            <input type='submit' value='Submit' className='btn btn-primary' />
        </form>
    );
}

export default TaskForm;