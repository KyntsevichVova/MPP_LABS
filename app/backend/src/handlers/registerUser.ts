import { Auth } from '../lib/auth';
import { Connection } from '../lib/connection';
import { Exception, HttpStatus } from '../lib/exception';
import { AuthPayload, RegisterUserCredentials, RequestHandler } from '../lib/types';

export function registerUser(con: Connection): RequestHandler {
    return (req, res, next) => {
        Promise.resolve(req.body as RegisterUserCredentials).then((creds) => {
            const { validCreds, errors } = Auth.validateRegister(con, creds);

            if (errors) {
                res
                    .status(HttpStatus.BAD_REQUEST)
                    .send({ creds, errors })
                    .end();
                return;
            }

            con.query(
                `INSERT INTO 'USER'
                    (EMAIL, 'PASSWORD')
                VALUES
                    ($1, $2)
                RETURNING
                    USER_ID, EMAIL`,
                [validCreds.email, validCreds.password]
            ).then((result) => {
                req.payload = result.rows[0] as AuthPayload;
                next();
            }).catch((reason) => {
                throw Exception.DatabaseError(reason);
            });
        }).catch(next);
    }
}