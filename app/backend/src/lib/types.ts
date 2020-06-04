import { Request, Response } from 'express';
import { Socket } from 'socket.io';

export interface AuthPayload {
    user_id: number;
    email: string;
}

export interface AuthRequest extends Request {
    payload?: AuthPayload;
}

export type RequestHandler = (req: AuthRequest, res: Response, next) => void;
export type SocketHandler = (socket: Socket, next) => void;

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