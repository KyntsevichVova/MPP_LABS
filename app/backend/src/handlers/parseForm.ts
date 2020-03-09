import Busboy from 'busboy';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { Connection } from '../lib/connection';
import { UPLOADS_DIR } from '../lib/constants';
import { RequestHandler } from '../lib/types';

export function parseForm(con: Connection): RequestHandler {
    return (req, res, next) => {
        const fields: Array<Promise<any>> = [];

        const busboy = new Busboy({
            headers: req.headers,
            limits: {
                files: 1
            }
        });

        busboy.on('file', (fieldname, file, filename) => {
            if (filename.length === 0) {
                file.resume();
                return;
            }

            fields.push(writeFile(con, file, filename));
        });

        busboy.on('field', (fieldname, val) => {
            fields.push(Promise.resolve({
                [fieldname]: val
            }));
        });

        busboy.on('finish', () => {
            Promise.all(fields).then((value) => {
                let body = {};
                value.forEach((field) => {
                    body = {
                        ...body,
                        ...field
                    };
                });
                req.body = body;
                next();
            }).catch((reason) => {
                console.log(reason);
                next(reason);
            });
        });

        req.pipe(busboy);
    }
}

function writeFile(con: Connection, file: NodeJS.ReadableStream, filename: string): Promise<object> {
    return new Promise((resolve) => {
        con.query(
            `INSERT INTO TASK_FILE
                (TASK_ID, FILE_NAME)
            VALUES
                (-1, $1)
            RETURNING
                file_id`,
            [filename]
        ).then((result) => {
            const file_id = result.rows[0].file_id;
            const saveTo = join(process.cwd(), UPLOADS_DIR, `${file_id}`);
            file.pipe(createWriteStream(saveTo));
            resolve({ file_id });
        });
    });
}