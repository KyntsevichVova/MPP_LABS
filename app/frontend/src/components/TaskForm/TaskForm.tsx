import React from 'react';
import { Errors, InputTask } from '../../lib/types';

interface TaskFormProps {
    task: InputTask | undefined;
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
            setData(task);
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
                <div className='form-check'>
                    <input
                        className='form-check-input'
                        type='radio'
                        name='task_status'
                        value='OPENED'
                        id='r_OPENED'
                        checked={data.task_status === 'OPENED'}
                        onChange={changeHandler}
                    />
                    <label className='form-check-label' htmlFor='r_OPENED'>Opened</label>
                </div>

                <div className='form-check'>
                    <input
                        className='form-check-input'
                        type='radio'
                        name='task_status'
                        value='INPROGRESS'
                        id='r_INPROGRESS'
                        checked={data.task_status === 'INPROGRESS'}
                        onChange={changeHandler}
                    />
                    <label className='form-check-label' htmlFor='r_INPROGRESS'>In progress</label>
                </div>
                
                <div className='form-check'>
                    <input 
                        className='form-check-input'
                        type='radio'
                        name='task_status'
                        value='CLOSED'
                        id='r_CLOSED'
                        checked={data.task_status === 'CLOSED'}
                        onChange={changeHandler}
                    />
                    <label className='form-check-label' htmlFor='r_CLOSED'>Closed</label>
                </div>
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