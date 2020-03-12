import { Connection } from '../lib/connection';
import { RegisterUserCredentials, RequestHandler } from '../lib/types';

export function registerUser(con: Connection): RequestHandler {
    return (req, res, next) => {
        Promise.resolve(req.body as RegisterUserCredentials).then((creds) => {
            
        }).catch(next);
    }
}