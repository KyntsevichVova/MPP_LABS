import { verify } from 'jsonwebtoken';
import { Exception } from '../lib/exception';
import { RequestHandler } from '../lib/types';

export function checkAuth(): RequestHandler {
    return (req, res, next) => {
        Promise.resolve().then(() => {
            const token = req.cookies.token;
            if (token) {
                try {
                    const payload = verify(token, process.env.JWT_KEY);
                    req.token = payload as object;
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