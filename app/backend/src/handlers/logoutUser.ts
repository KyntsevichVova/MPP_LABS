import { HttpStatus } from '../lib/exception';
import { RequestHandler } from '../lib/types';

export function logoutUser(): RequestHandler {
    return (req, res, next) => {
        Promise.resolve().then(() => {
            res
                .status(HttpStatus.OK)
                .clearCookie('token')
                .end();
        }).catch(next);
    }
}