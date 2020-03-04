export interface Task {
    task_id?: number;
    task_status?: {
        text: string;
        value: string;
    }
    task_text?: string;
    estimated_end_at?: string;
    file_id?: string;
    deadline?: boolean;
}

export interface Errors {
    text_short?: boolean,
    text_long?: boolean,
    estimated_end_at?: boolean,
    status_present?: boolean
}    