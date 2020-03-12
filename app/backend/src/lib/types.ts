import { Request, Response } from 'express';

export interface AuthPayload {
    user_id: number;
    email: string;
}

export interface AuthRequest extends Request {
    token?: object;
    payload?: AuthPayload;
}

export type RequestHandler = (req: AuthRequest, res: Response, next) => void;

export interface UserCredentials {
    email?: string;
    password?: string;
}

export interface LoginUserCredentials extends UserCredentials {}
export interface RegisterUserCredentials extends UserCredentials {}

export interface Status {
    text: string;
    value: string;
}