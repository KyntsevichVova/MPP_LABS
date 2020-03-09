export interface Status {
    text: string,
    value: string
}

export const STATUS = {
    OPENED: {
        text: 'Opened',
        value: 'OPENED'
    },
    INPROGRESS: {
        text: 'In progress',
        value: 'INPROGRESS'
    },
    CLOSED: {
        text: 'Closed',
        value: 'CLOSED'
    }
};

export const DEFAULT_FILTER = Object.entries(STATUS).map(([key, value]) => value.value);

export const UPLOADS_DIR = 'uploads';

export const FILES_ENDPOINT = '/files';
export const TASKS_ENDPOINT = '/tasks';

export const MAX_TASK_TEXT_LENGTH = 250;

export const months_in_year = 12;

export const days_in_month = [
    [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
];