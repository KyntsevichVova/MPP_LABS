import { ADD_ENDPOINT, EDIT_ENDPOINT, MAX_TASK_TEXT_LENGTH, STATUS, SUBMIT_TYPE } from './constants';
import { parseDate, printDate } from './utils';

export interface Task {
    task_id?: string,
    task_text?: string,
    task_status?: string,
    estimated_end_at?: string,
    file_id?: string,
    created_at?: string,
    deadline?: boolean
}

export interface ValidationError {
    text_short?: boolean,
    text_long?: boolean,
    estimated_end_at?: boolean,
    status_present?: boolean
}

export interface ValidatedTask {
    task: Task,
    errors: ValidationError | undefined
}

export interface Page {
    title: string,
    formAction?: string
}

export class Model {
    page: Page;
    tasks: Array<Task>;
    errors: ValidationError;
    endpoints = {
        ADD_ENDPOINT,
        EDIT_ENDPOINT
    };

    constructor(tasks: Array<Task> = [], task_id: number = 0, submit_type?: SUBMIT_TYPE, errors?: ValidationError) {
        this.tasks = tasks;
        this.errors = errors;
        
        switch (submit_type) {
            case SUBMIT_TYPE.ADD:
                this.page = {
                    title: 'Add task',
                    formAction: `${ADD_ENDPOINT}&task_id=${task_id}`
                };
                break;
        
            case SUBMIT_TYPE.EDIT:
                this.page = {
                    title: 'Edit task',
                    formAction: `${EDIT_ENDPOINT}&task_id=${task_id}`
                };
                break;

            default:
                this.page = {
                    title: 'Index'
                };
                break;
        }
    }

    static createTask(value: Task): Task {
        return {
            task_id: value.task_id,
            task_text: value.task_text,
            task_status: STATUS[value.task_status].value,
            created_at: value.created_at,
            estimated_end_at: printDate(new Date(value.estimated_end_at)),
            deadline: (new Date() >= new Date(value.estimated_end_at)),
            file_id: value.file_id
        };
    }

    static validateTask(task: Task): ValidatedTask {
        
        const validTask: Task = {
            task_text: task.task_text ?? '',
            task_status: task.task_status ? STATUS[task.task_status]?.value : null,
            estimated_end_at: parseDate(task.estimated_end_at),
            file_id: task.file_id
        };

        const errors = {
            text_short: validTask.task_text.length < 1,
            text_long: validTask.task_text?.length >= MAX_TASK_TEXT_LENGTH,
            estimated_end_at: !validTask.estimated_end_at,
            status_present: !validTask.task_status
        };

        const errorPresent = errors.text_short || errors.text_long || errors.estimated_end_at || errors.status_present;

        return {
            task: validTask,
            errors: errorPresent ? errors : undefined
        };
    }
}