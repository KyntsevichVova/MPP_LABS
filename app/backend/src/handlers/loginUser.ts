import { Connection } from '../lib/connection';
import { RequestHandler, LoginUserCredentials } from '../lib/types';

export function loginUser(con: Connection): RequestHandler {
    return (req, res, next) => {
        Promise.resolve(req.body as LoginUserCredentials).then((creds) => {
            
        }).catch(next);
    }
}