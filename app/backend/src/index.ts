import { config } from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import { join } from 'path';
import socketio from 'socket.io';
import { createTask, getTask, getTasks, loginUser, registerUser, updateTask } from './handlers';
import { Connection, ConnectionOptions, PostgreSQLConnection } from './lib/connection';
import { AUTH_ENDPOINT, TASKS_ENDPOINT } from './lib/constants';
import { AuthPayload } from './lib/types';
import { checkAuth, issueToken } from './middleware';

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
    app.use(express.static(join(__dirname, 'public')))

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