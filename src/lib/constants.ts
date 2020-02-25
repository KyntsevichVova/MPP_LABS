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

export enum SUBMIT_TYPE {
    ADD = 'add',
    EDIT = 'edit'
};

export const SUBMIT_ENDPOINT = 'submit_task';

export const MAX_TASK_TEXT_LENGTH = 250;