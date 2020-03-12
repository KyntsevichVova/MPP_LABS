import { HttpStatus } from '../lib/exception';
import { LoginUserCredentials, RequestHandler } from '../lib/types';

export function logoutUser(): RequestHandler {
    return (req, res, next) => {
        Promise.resolve(req.body as LoginUserCredentials).then((creds) => {
            res
                .status(HttpStatus.OK)
                .clearCookie('token')
                .end();
            next();
        }).catch(next);
    }
}