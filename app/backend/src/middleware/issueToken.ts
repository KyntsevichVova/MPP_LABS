import { sign } from 'jsonwebtoken';
import { HttpStatus } from '../lib/exception';
import { RequestHandler } from '../lib/types';

export function issueToken(): RequestHandler {
    return (req, res, next) => {
        Promise.resolve(req.payload).then((payload) => {
            const expiresIn = 60 * 60;
            const token = sign(payload, process.env.JWT_KEY, {
                expiresIn: expiresIn
            });
            res
                .status(HttpStatus.OK)
                .cookie('token', token, {
                    maxAge: expiresIn,
                    httpOnly: true,
                })
                .end();
        }).catch(next);
    }
}