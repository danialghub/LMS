import { courseSchema, chapterSchema, lectureSchema } from "../validators/course.validator.js";
import { HTTPSTATUS } from "../config/http.config.js";
import {
    createTransacionService,
    updateTransactionStatusService
} from "../services/transaction.service.js";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";

export const createTransaction = asyncHandler(
    async (req, res) => {
        const user = req.user
        const { courseId } = req.body

        if(!courseId)
            return res.sendStatus(HTTPSTATUS.BAD_REQUEST)
        
        await createTransacionService( courseId, user._id)


        res.sendStatus(HTTPSTATUS.CREATED)

    }
)
export const updateTransactionStatus = asyncHandler(
    async (req, res) => {
        const user = req.user
        const { courseId } = req.params
        const body = req.body

if(!body)
    return res.sendStatus(HTTPSTATUS.BAD_REQUEST)
        await updateTransactionStatusService(body, courseId, user._id)


        res.sendStatus(HTTPSTATUS.OK)

    }
)