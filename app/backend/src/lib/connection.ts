import mysql from 'mysql';
import { Client } from 'pg';

interface QueryResult {
    rows: Array<any>
}

type QueryCallback = (error: Error, result: QueryResult) => void;

export interface Connection {
    connect(): Promise<void>;

    query(sql: string, callback: QueryCallback): void;
    query(sql: string, params?: Array<any>): Promise<QueryResult>;
    query(sql: string, params: Array<any>, callback: QueryCallback): void;

    escape(s: string): string;
}

export interface ConnectionOptions {
    user?: string;
    password?: string;
    database?: string;
    host?: string;
}

export class MySQLConnection implements Connection {
    private con: mysql.Connection;

    constructor(options: ConnectionOptions) {
        this.con = mysql.createConnection(options);
    }

    connect() {
        return new Promise<void>((resolve, reject) => {
            this.con.connect((err) => {
                if (err) {
                    console.log('Cannot connect to MySQL');
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    query(sql: string, params: any, callback?: QueryCallback) {
        if ((typeof params === 'function') && !callback) {
            callback = params;
            this.con.query(sql, callback);
        } else if (callback) {
            this.con.query(sql, params, callback);   
        } else {
            return new Promise<QueryResult>((resolve, reject) => {
                this.con.query(sql, params, (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({rows: results});
                    }
                })
            });
        }
    }

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
        return new Promise<void>((resolve, reject) => {
            this.client.connect((err) => {
                if (err) {
                    console.log('Cannot connect to Postgres');
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    query(sql: string, params: any, callback?: QueryCallback) {
        if ((typeof params === 'function') && !callback) {
            callback = params;
            this.client.query(sql, callback);
        } else if (callback) {
            this.client.query(sql, params, callback);   
        } else {
            return this.client.query(sql, params);
        }
    };

    escape(s: string): string {
        return this.client.escapeLiteral(s);
    }
}