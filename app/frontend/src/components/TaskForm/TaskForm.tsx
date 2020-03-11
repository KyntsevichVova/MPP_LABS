import React from 'react';
import { Errors, InputTask, OutputTask } from '../../lib/types';
import { STATUS } from '../../lib/constants';

interface TaskFormProps {
    task: OutputTask | undefined;
    errors?: Errors;
    submitCallback: Function;
}

const emptyTask: InputTask = {
    task_text: '',
    task_status: 'OPENED',
    estimated_end_at: ''
}

function TaskForm({
    task, errors, submitCallback
}: TaskFormProps) {

    const [data, setData] = React.useState(task || emptyTask);

    React.useEffect(() => {
        if (task) {
            setData({
                ...task,
                task_status: task.task_status?.value
            });
        }
    }, [task]);

    const changeHandler = (event: any) => {
        setData({...data, [event.target.name]: event.target.value})
    };

    const handleFiles = (e: any) => {
        const file = e.target.files[0];
        setData({ ...data, att_file: file });
    }

    const callback = React.useCallback(() => {
        submitCallback(data);
    }, [submitCallback, data]);

    return (
        <div>
            <div className='form-group'>
                <label htmlFor='task_text'>Task:</label>
                <textarea 
                    className={`form-control ${(errors && (errors.text_long || errors.text_short)) ? 'is-invalid' : ''}`} 
                    id='task_text' 
                    maxLength={250}
                    name='task_text'
                    value={data.task_text}
                    onChange={changeHandler}
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
                {Object.entries(STATUS).map(([key, status]) => (
                    <div className='form-check' key={status.value}>
                        <input
                            className='form-check-input'
                            type='radio'
                            name='task_status'
                            value={status.value}
                            id={`r_${status.value}`}
                            checked={data.task_status === status.value}
                            onChange={changeHandler}
                        />
                        <label className='form-check-label' htmlFor={`r_${status.value}`}>{status.text}</label>
                    </div>
                ))}
            </div> 

            <div className='form-group'>
                <label htmlFor='estimated_end_at'>Estimated end:</label>
                <input
                    className='form-control'
                    type='text'
                    name='estimated_end_at'
                    value={data.estimated_end_at}
                    id='estimated_end_at'
                    onChange={changeHandler}
                />
                {(errors && errors.estimated_end_at) && (
                    <small className='text-danger'>
                        Should be a date in 'DD.MM.YYYY' format.
                    </small>
                )}  
            </div>
            
            <div className='form-group'>
                <label htmlFor='att_file'>Attachment:</label>
                <input
                    className='form-control-file'
                    type='file'
                    name='att_file'
                    id='att_file'
                    onChange={handleFiles}
                />
            </div>

            <button className='btn btn-primary' onClick={callback}>
                Submit
            </button>
        </div>
    );
}

export default TaskForm;