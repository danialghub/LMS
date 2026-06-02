import { HTTPSTATUS } from "../config/http.config.js";
import { AppError, ErrorCodes } from "../utils/app.error.js";

export const errorHandler = (
    error,
    req,
    res,
    next
) => {
    console.log(`Error occurred: ${req.path}`, error);

    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            message: error.message,
            errorCode: error.errorCode,
        });
    }

    return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
        error: error?.message || "Something went wrong",
        errorCode: ErrorCodes.ERR_INTERNAL,
    });
};
