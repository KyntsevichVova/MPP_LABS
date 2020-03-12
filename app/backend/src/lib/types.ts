import { Request, Response } from 'express';

interface AuthRequest extends Request {
    token?: any;
}

export type RequestHandler = (req: AuthRequest, res: Response, next) => void;