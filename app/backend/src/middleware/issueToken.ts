import { sign } from 'jsonwebtoken';
import { HttpStatus } from '../lib/exception';

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
    }
}