import { Request, Response } from 'express';

export type RequestHandler = (req: Request, res: Response) => void;

export { handleAdd } from './handlers/add';
export { handleDownload } from './handlers/download';
export { handleEdit } from './handlers/edit';
export { handleIndex } from './handlers/index';
export { handleSubmitTask } from './handlers/submit';
export { handleTask } from './handlers/task';