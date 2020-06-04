import { Auth } from '../lib/auth';
import { Connection } from '../lib/connection';
import { Exception, HttpStatus } from '../lib/exception';
import { AuthPayload, RegisterUserCredentials, RequestHandler } from '../lib/types';

export function registerUser(con: Connection) {
    return (creds: RegisterUserCredentials) => {
        return new Promise((resolve, reject) => {
            Auth.validateRegister(con, creds).then(({ validCreds, errors }) => {
                if (errors) {
                    const response = {
                        status: HttpStatus.BAD_REQUEST,
                        data: { creds, errors },
                    }
                    reject(response);
                    return;
                }
    
                con.query(
                    `INSERT INTO "USER"
                        (EMAIL, "PASSWORD")
                    VALUES
                        ($1, $2)
                    RETURNING
                        USER_ID, EMAIL`,
                    [validCreds.email, validCreds.password]
                ).then((result) => {
                    resolve(result.rows[0] as AuthPayload);
                }).catch((reason) => {
                    //throw Exception.DatabaseError(reason);
                });
            });
        });
        /*Promise.resolve(req.body as RegisterUserCredentials).then((creds) => {
            Auth.validateRegister(con, creds).then(({ validCreds, errors }) => {
                if (errors) {
                    res
                        .status(HttpStatus.BAD_REQUEST)
                        .send({ creds, errors })
                        .end();
                    return;
                }
    
                con.query(
                    `INSERT INTO "USER"
                        (EMAIL, "PASSWORD")
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
            });
        }).catch(next);*/
    }
}