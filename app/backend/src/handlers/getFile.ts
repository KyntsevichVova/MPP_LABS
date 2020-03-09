import { existsSync } from 'fs';
import { join } from 'path';
import { Connection } from '../lib/connection';
import { UPLOADS_DIR } from '../lib/constants';
import { Exception } from '../lib/exception';
import { RequestHandler } from '../lib/types';

export function getFile(con: Connection): RequestHandler {
    return (req, res, next) => {
        Promise.resolve().then(() => {
            const file_id = Number.parseInt(req.params.file_id, 10);
        
            if (file_id) {
                const filename = join(process.cwd(), UPLOADS_DIR, String(file_id));
                if (existsSync(filename)) {
                    con.query(
                        `SELECT
                            FILE_NAME
                        FROM
                            TASK_FILE
                        WHERE
                            FILE_ID = ${file_id}`, 
                        (error, result) => {
                            if (error) {
                                throw Exception.DATABASE_ERROR;
                            }
                            if (result.rows.length < 1) {
                                throw Exception.FILE_NOT_FOUND;
                            } else {
                                res.download(filename, result.rows[0].file_name);
                            }
                        }
                    );
                } else {
                    throw Exception.FILE_NOT_FOUND;
                }
            } else {
                throw Exception.BAD_REQUEST;
            }
        }).catch(next);
    }
}