import { config } from 'dotenv';
import express from 'express';
import { join } from 'path';
import { Connection, ConnectionOptions, PostgreSQLConnection } from './lib/connection';
import { handleAdd, handleDownload, handleEdit, handleIndex, handleSubmitTask } from './routes/routes';

config();

const app = express();

const connectionOptions: ConnectionOptions = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
};

//const con: Connection = new MySQLConnection(connectionOptions);
const con: Connection = new PostgreSQLConnection(connectionOptions);
con.connect();

app.use(express.urlencoded());
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));

app.get('/', handleIndex(con));
app.get('/add', handleAdd());
app.get('/edit', handleEdit(con));
app.get('/download', handleDownload());
app.post('/submit_task', handleSubmitTask(con));

app.listen(3000);