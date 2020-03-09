import { ErrorRequestHandler } from "express";
import { Exception, HttpStatus } from "../lib/exception";

export function handleException(): ErrorRequestHandler {
    return (err, req, res, next) => {
        const reason = err as Exception;
        switch (reason) {
            case Exception.FILE_NOT_FOUND:
                res.status(HttpStatus.NOT_FOUND).end();
                break;
            case Exception.DATABASE_ERROR:
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
                break;
            case Exception.BAD_REQUEST:
                res.status(HttpStatus.BAD_REQUEST).end();
                break;
            default:
                next(reason);
        }
    }
}