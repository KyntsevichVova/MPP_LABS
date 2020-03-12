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

            const payload = req.payload;
        
            if (file_id) {
                const filename = join(process.cwd(), UPLOADS_DIR, String(file_id));
                if (existsSync(filename)) {
                    con.query(
                        `SELECT
                            FILE_NAME
                        FROM
                            TASK_FILE
                        WHERE
                            FILE_ID = ${file_id}
                        AND
                            CREATED_BY = $1`,
                        [payload.user_id], 
                        (error, result) => {
                            if (error) {
                                throw Exception.DatabaseError(error);
                            }
                            if (result.rows.length < 1) {
                                throw Exception.FileNotFound();
                            } else {
                                res.download(filename, result.rows[0].file_name);
                            }
                        }
                    );
                } else {
                    throw Exception.FileNotFound();
                }
            } else {
                throw Exception.BadRequest();
            }
        }).catch(next);
    }
}