import bcrypt from 'bcryptjs';
import { Connection } from './connection';
import { LoginUserCredentials, RegisterUserCredentials } from './types';

export interface RegisterError {
    email_required?: boolean;
    email_long?: boolean;
    password_required?: boolean;
    invalid_email?: boolean;
    short_password?: boolean;
    long_password?: boolean;
    email_exists?: boolean;
}

export interface LoginError {
    email_required?: boolean;
    email_long?: boolean;
    password_required?: boolean;
    no_such_user?: boolean;
}

export interface ValidRegisterCredentials {
    validCreds?: Required<RegisterUserCredentials>;
    errors?: RegisterError;
}

export interface ValidLoginCredentials {
    validCreds?: {
        user_id: number;
        email: string;
    };
    errors?: LoginError;
}

export class Auth {
    static validateRegister(con: Connection, creds: RegisterUserCredentials): ValidRegisterCredentials {
        const { email, password } = creds;
        const errors: RegisterError = {};
        let anyError = false;
        if (!email) {
            errors.email_required = true;
            anyError = true;
        }
        if (email.length > 50) {
            errors.email_long = true;
            anyError = true;
        }
        if (!password) {
            errors.password_required = true;
            anyError = true;
        }
        if (password.length < 4) {
            errors.short_password = true;
            anyError = true;
        }
        if (password.length > 32) {
            errors.long_password = true;
            anyError = true;
        }
        con.query(
            `SELECT 
                * 
            FROM 
                "USER"
            WHERE
                EMAIL=$1
            `,
            [email]
        ).then((result) => {
            if (result.rows.length > 0) {
                errors.email_exists = true;
                anyError = true;
            }
        });

        const hash = bcrypt.hashSync(password, 10);

        return {
            validCreds: {
                email,
                password: hash
            },
            errors: anyError ? errors : undefined
        }
    }

    static validateLogin(con: Connection, creds: LoginUserCredentials): ValidLoginCredentials {
        const { email, password } = creds;
        const errors: LoginError = {};
        let anyError = false;
        if (!email) {
            errors.email_required = true;
            anyError = true;
        }
        if (email.length > 50) {
            errors.email_long = true;
            anyError = true;
        }
        if (!password) {
            errors.password_required = true;
            anyError = true;
        }

        const validCreds: any = {};

        con.query(
            `SELECT 
                * 
            FROM 
                "USER"
            WHERE
                EMAIL=$1
            `,
            [email]
        ).then((result) => {
            if (result.rows.length < 1) {
                errors.no_such_user = true;
                anyError = true;
            } else {
                if (!bcrypt.compareSync(password, result.rows[0].PASSWORD)) {
                    errors.no_such_user = true;
                    anyError = true;
                } else {
                    validCreds.email = result.rows[0].email;
                    validCreds.user_id = result.rows[0].user_id;
                }
            }
        });

        return {
            validCreds,
            errors: anyError ? errors : undefined
        }
    }
}