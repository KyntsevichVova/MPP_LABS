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

export enum Exception {
    FILE_NOT_FOUND,
    DATABASE_ERROR,
    BAD_REQUEST,
    ENTITY_NOT_FOUND,
}