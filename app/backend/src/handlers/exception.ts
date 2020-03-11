import { ErrorRequestHandler } from "express";
import { Exception, ExceptionType, HttpStatus } from "../lib/exception";

export function handleException(): ErrorRequestHandler {
    return (err, req, res, next) => {
        const reason = err as Exception;
        switch (reason.type) {
            case ExceptionType.FILE_NOT_FOUND:
                res.status(HttpStatus.NOT_FOUND).end();
                break;
            case ExceptionType.DATABASE_ERROR:
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
                break;
            case ExceptionType.BAD_REQUEST:
                res.status(HttpStatus.BAD_REQUEST).end();
                break;
            default:
                next(reason);
        }
    }
}