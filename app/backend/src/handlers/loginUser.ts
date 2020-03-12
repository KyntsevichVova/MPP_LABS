import { Auth } from '../lib/auth';
import { Connection } from '../lib/connection';
import { HttpStatus } from '../lib/exception';
import { AuthPayload, LoginUserCredentials, RequestHandler } from '../lib/types';

export function loginUser(con: Connection): RequestHandler {
    return (req, res, next) => {
        Promise.resolve(req.body as LoginUserCredentials).then((creds) => {
            const { validCreds, errors } = Auth.validateLogin(con, creds);

            if (errors) {
                res
                    .status(HttpStatus.BAD_REQUEST)
                    .send({ creds, errors })
                    .end();
                return;
            }

            req.payload = validCreds as AuthPayload;
            next();
        }).catch(next);
    }
}