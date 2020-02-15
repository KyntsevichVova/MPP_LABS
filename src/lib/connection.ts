import mysql from 'mysql';
import { Client } from 'pg';

export interface Connection {
    connect();
    query(sql: string, callback: (error, result) => void, params?: Array<any>): void;
    escape(s: string): string;
}

export interface ConnectionOptions {
    user?: string;
    password?: string;
    database?: string;
}

export class MySQLConnection implements Connection {
    private con: mysql.Connection;

    constructor(options: ConnectionOptions) {
        this.con = mysql.createConnection(options);
    }

    connect() {
        this.con.connect((err) => {
            if (err) {
                console.log('Cannot connect to MySQL');
                throw err;
            }
        });
    }

    query(sql: string, callback: (error, result) => void): void {
        this.con.query(sql, callback);
    };

    escape(s: string): string {
        return this.con.escape(s);
    }
}

export class PostgreSQLConnection implements Connection {
    private client: Client;

    constructor(options: ConnectionOptions) {
        this.client = new Client(options);
    }

    connect() {
        this.client.connect((err) => {
            if (err) {
                console.log('Cannot connect to Postgres');
                throw err;
            }
        });
    }

    query(sql: string, callback: (error, result) => void, params: Array<any>): void {
        this.client.query(sql, params, callback);
    }

    escape(s: string): string {
        return this.client.escapeLiteral(s);
    }
}