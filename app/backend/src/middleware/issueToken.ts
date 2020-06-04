import { sign } from 'jsonwebtoken';
import { HttpStatus } from '../lib/exception';
import { RequestHandler } from '../lib/types';

export function issueToken() {
    return (payload) => {
        return new Promise((resolve) => {
            const expiresIn = 60 * 60;
            const token = sign(payload, process.env.JWT_KEY, {
                expiresIn: expiresIn
            });
            const response = {
                status: HttpStatus.OK,
                token,
            }
            resolve(response);
        });
        /*Promise.resolve(req.payload).then((payload) => {
            const expiresIn = 60 * 60;
            const token = sign(payload, process.env.JWT_KEY, {
                expiresIn: expiresIn
            });
            res
                .status(HttpStatus.OK)
                .cookie('token', token, {
                    maxAge: expiresIn * 1000,
                    httpOnly: true,
                })
                .end();
        }).catch(next);*/
    }
}