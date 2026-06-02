import { HTTPSTATUS } from "../config/http.config.js";

export const ErrorCodes = {
    ERR_INTERNAL: "ERR_INTERNAL",
    ERR_BAD_REQUEST: "ERR_BAD_REQUEST",
    ERR_UNAUTHORIZED: "ERR_UNAUTHORIZED",
    ERR_FORBIDDEN: "ERR_FORBIDDEN",
    ERR_NOT_FOUND: "ERR_NOT_FOUND",
};

export class AppError extends Error {
    constructor(message, statusCode = HTTPSTATUS.INTERNAL_SERVER_ERROR, errorCode = ErrorCodes.ERR_INTERNAL) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class InternalServerException extends AppError {
    constructor(message = "Internal Server Error") {
        super(message, HTTPSTATUS.INTERNAL_SERVER_ERROR, ErrorCodes.ERR_INTERNAL);
    }
}

export class NotFoundException extends AppError {
    constructor(message = "یافت نشد") {
        super(message, HTTPSTATUS.NOT_FOUND, ErrorCodes.ERR_NOT_FOUND);
    }
}

export class BadRequestException extends AppError {
    constructor(message = "داده ناقص است") {
        super(message, HTTPSTATUS.BAD_REQUEST, ErrorCodes.ERR_BAD_REQUEST);
    }
}

export class UnauthorizedException extends AppError {
    constructor(message = "دسترسی غیر  مجاز") {
        super(message, HTTPSTATUS.UNAUTHORIZED, ErrorCodes.ERR_UNAUTHORIZED);
    }
}
