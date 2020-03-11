import { config } from 'dotenv';
import express from 'express';
import { join } from 'path';
import { createTask, getFile, getTask, getTasks, handleException, parseForm, updateTask } from './handlers';
import { Connection, ConnectionOptions, PostgreSQLConnection } from './lib/connection';
import { FILES_ENDPOINT, TASKS_ENDPOINT } from './lib/constants';

config();

const app = express();

const connectionOptions: ConnectionOptions = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST
};

//const con: Connection = new MySQLConnection(connectionOptions);
const con: Connection = new PostgreSQLConnection(connectionOptions);

con.connect().then(() => {
    app.use(express.static(join(__dirname, 'public')));

    app.get(`${FILES_ENDPOINT}/:file_id`, getFile(con));

    app.route(`${TASKS_ENDPOINT}`)
        .get(getTasks(con))
        .post(parseForm(con), createTask(con));

    app.route(`${TASKS_ENDPOINT}/:task_id`)
        .get(getTask(con))
        .post(parseForm(con), updateTask(con));

    app.use(handleException());

    app.listen(3000);
}).catch((reason) => {
    throw reason;
});