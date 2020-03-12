export enum HttpStatus {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNATHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
}

export enum ExceptionType {
    FILE_NOT_FOUND,
    DATABASE_ERROR,
    BAD_REQUEST,
    ENTITY_NOT_FOUND,
    AUTH_REQUIRED,
}

export class Exception {
    reason: any;
    type: ExceptionType;

    constructor(type: ExceptionType, reason?: any) {
        this.type = type;
        this.reason = reason;
        if (reason) {
            console.log(reason);
        }
    }

    static FileNotFound(reason?: any) {
        return new Exception(ExceptionType.FILE_NOT_FOUND, reason);
    }

    static DatabaseError(reason?: any) {
        return new Exception(ExceptionType.DATABASE_ERROR, reason);
    }

    static BadRequest(reason?: any) {
        return new Exception(ExceptionType.BAD_REQUEST, reason);
    }

    static EntityNotFound(reason?: any) {
        return new Exception(ExceptionType.ENTITY_NOT_FOUND, reason);
    }

    static AuthRequired(reason?: any) {
        return new Exception(ExceptionType.AUTH_REQUIRED, reason);
    }
}