import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import express from 'express';
import { join } from 'path';
import { createTask, getFile, getTask, getTasks, loginUser, logoutUser, registerUser, updateTask } from './handlers';
import { Connection, ConnectionOptions, PostgreSQLConnection } from './lib/connection';
import { AUTH_ENDPOINT, FILES_ENDPOINT, TASKS_ENDPOINT } from './lib/constants';
import { checkAuth, handleException, issueToken, parseForm } from './middleware';
import graphqlHTTP from 'express-graphql';
import { schema } from './lib/schema';

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
    const AuthRouter = express.Router();
    const FileRouter = express.Router();
    const TaskCollectionRouter = express.Router();
    const TaskRouter = express.Router();

    AuthRouter
        .post(`${AUTH_ENDPOINT}/logout`, logoutUser())
        .post(`${AUTH_ENDPOINT}/login`, parseForm(con), loginUser(con), issueToken())
        .post(`${AUTH_ENDPOINT}/register`, parseForm(con), registerUser(con), issueToken());

    FileRouter.route(`${FILES_ENDPOINT}/:file_id`)
        .get(getFile(con));

    /*TaskCollectionRouter.route(`${TASKS_ENDPOINT}`)
        .get(getTasks(con))
        .post(parseForm(con), createTask(con));

    TaskRouter.route(`${TASKS_ENDPOINT}/:task_id`)
        .get(getTask(con))
        .post(parseForm(con), updateTask(con));*/


    const root = {
        getTask: getTask(con),
        getTasks: getTasks(con),
        createTask: createTask(con),
        updateTask: updateTask(con),
    };

    app
        .use(express.static(join(__dirname, 'public')))
        .use(cookieParser())
        .use(AuthRouter)
        .use(checkAuth())
        .use(FileRouter)
        .use('/form', parseForm(con), (req, res) => res.send(req.body).status(200).end())
        .use('/graphql', (req, res, next) => {
            return graphqlHTTP({
                schema: schema,
                rootValue: root,
                context: { req, res, next },
                graphiql: true,
            })(req, res)
        })
        .use(handleException());
        
    app.listen(3000);
}).catch((reason) => {
    throw reason;
});