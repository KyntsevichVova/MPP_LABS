import { existsSync } from 'fs';
import { basename, join, normalize } from 'path';
import { Connection } from '../../lib/connection';
import { UPLOADS_DIR } from '../../lib/constants';
import { RequestHandler } from '../routes';

export function handleDownload(con: Connection): RequestHandler {
    return (req, res) => {
        const file_id = Number.parseInt(req.query.file_id);
        if (file_id) {
            const filename = join(process.cwd(), UPLOADS_DIR, basename(normalize(String(file_id))));
            if (existsSync(filename)) {
                con.query(
                    `SELECT FILE_NAME FROM TASK_FILE
                    WHERE
                        FILE_ID = ${file_id}`, 
                    (error, result) => {
                        if (!error && result.rows.length >= 1) {
                            res.download(filename, result.rows[0].file_name);
                            return;
                        }
                    }
                );
            }
        }
        res.status(404).end();
    }
}