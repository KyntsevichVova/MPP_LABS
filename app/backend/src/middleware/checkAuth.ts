import { verify } from 'jsonwebtoken';
import { Exception, HttpStatus } from '../lib/exception';
import { AuthPayload, RequestHandler } from '../lib/types';

export function checkAuth() {
    return (token) => {
        return new Promise((resolve, reject) => {
            if (token) {
                try {
                    const payload = verify(token, process.env.JWT_KEY);
                    resolve(payload as AuthPayload);
                } catch (e) {
                    const response = {
                        status: HttpStatus.UNATHORIZED,
                    }
                    reject(response);
                }
            } else {
                const response = {
                    status: HttpStatus.UNATHORIZED,
                }
                reject(response);
            }
        });
        /*Promise.resolve().then(() => {
            const token = req.cookies.token;
            if (token) {
                try {
                    const payload = verify(token, process.env.JWT_KEY);
                    req.payload = payload as AuthPayload;
                    next();
                } catch (e) {
                    throw Exception.AuthRequired(e);
                }
            } else {
                throw Exception.AuthRequired();
            }
        }).catch(next);*/
    }
}

export function checkAuthMiddleware(): RequestHandler {
    return (req, res, next) => {
        Promise.resolve().then(() => {
            const token = req.query.token;
            if (token) {
                try {
                    const payload = verify(token, process.env.JWT_KEY);
                    req.payload = payload as AuthPayload;
                    next();
                } catch (e) {
                    throw Exception.AuthRequired(e);
                }
            } else {
                throw Exception.AuthRequired();
            }
        }).catch(next);
    }
}