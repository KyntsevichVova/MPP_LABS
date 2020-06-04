import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import express, { response } from 'express';
import { createServer } from 'http';
import { join } from 'path';
import socketio from 'socket.io';
import { createTask, getFile, getTask, getTasks, loginUser, logoutUser, registerUser, updateTask } from './handlers';
import { Connection, ConnectionOptions, PostgreSQLConnection } from './lib/connection';
import { AUTH_ENDPOINT, FILES_ENDPOINT, TASKS_ENDPOINT } from './lib/constants';
import { checkAuth, handleException, issueToken, parseForm } from './middleware';
import { AuthPayload } from './lib/types';
import { HttpStatus } from './lib/exception';
import { checkAuthMiddleware } from './middleware/checkAuth';

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
    /*const AuthRouter = express.Router();
    const FileRouter = express.Router();
    const TaskCollectionRouter = express.Router();
    const TaskRouter = express.Router();

    AuthRouter
        .post(`${AUTH_ENDPOINT}/logout`, logoutUser())
        .post(`${AUTH_ENDPOINT}/login`, parseForm(con), loginUser(con), issueToken())
        .post(`${AUTH_ENDPOINT}/register`, parseForm(con), registerUser(con), issueToken());

    FileRouter.route(`${FILES_ENDPOINT}/:file_id`)
        .get(getFile(con));*/

    /*TaskCollectionRouter.route(`${TASKS_ENDPOINT}`)
        .get(getTasks(con))
        .post(parseForm(con), createTask(con));*/

    /*TaskRouter.route(`${TASKS_ENDPOINT}/:task_id`)
        .get(getTask(con))
        .post(parseForm(con), updateTask(con));*/

    app
        .use(express.static(join(__dirname, 'public')))
        //.use(cookieParser())
        //.use(AuthRouter)
        //.use(checkAuthMiddleware())
        //.use(FileRouter)
        //.use(TaskCollectionRouter)
        //.use(TaskRouter)
        //.use(handleException());

    const server = createServer(app);
    const io = socketio(server);

    const taskCollection = io.of(TASKS_ENDPOINT);
    taskCollection.on("connection", (socket) => {
        socket.on("get", (token, filters, callback) => {
            checkAuth()(token).then((payload: AuthPayload) => {
                getTasks(con)(payload, filters).then((response) => {
                    callback(response);
                }).catch((reason) => {
                    console.log(reason);
                });
            }).catch((response) => {
                callback(response);
            });
        });

        socket.on("post", (token, data, callback) => {
            checkAuth()(token).then((payload: AuthPayload) => {
                createTask(con)(payload, data).then((response) => {
                    callback(response);
                }).catch((reason) => {
                    console.log(reason);
                })
            }).catch((response) => {
                callback(response);
            })
        });
    });

    const task = io.of(`${TASKS_ENDPOINT}/id`);
    task.on("connection", (socket) => {
        socket.on("get", (token, id, callback) => {
            checkAuth()(token).then((payload: AuthPayload) => {
                getTask(con)(payload, id).then((response) => {
                    callback(response);
                }).catch((reason) => {
                    console.log(reason);
                });
            }).catch((response) => {
                callback(response);
            });
        });

        socket.on("post", (token, id, data, callback) => {
            checkAuth()(token).then((payload: AuthPayload) => {
                updateTask(con)(payload, id, data).then((response) => {
                    callback(response);
                }).catch((reason) => {
                    console.log(reason);
                })
            }).catch((response) => {
                callback(response);
            })
        });
    });

    const auth = io.of(AUTH_ENDPOINT);
    auth.on("connection", (socket) => {
        socket.on("login", (creds, callback) => {
            loginUser(con)(creds).then((payload) => {
                issueToken()(payload).then((response) => {
                    callback(response);
                });
            }).catch((response) => {
                callback(response);
            });
        });

        socket.on("register", (creds, callback) => {
            registerUser(con)(creds).then((payload) => {
                issueToken()(payload).then((response) => {
                    callback(response);
                });
            }).catch((response) => {
                callback(response);
            });
        });
    });
        
    server.listen(3000);
}).catch((reason) => {
    throw reason;
});