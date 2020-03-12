import { Request, Response } from 'express';

interface AuthRequest extends Request {
    token?: any;
}

export type RequestHandler = (req: AuthRequest, res: Response, next) => void;

export interface UserCredentials {
    email?: string;
    password?: string;
}

export interface LoginUserCredentials extends UserCredentials {}
export interface RegisterUserCredentials extends UserCredentials {}