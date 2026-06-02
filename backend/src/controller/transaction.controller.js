import { courseSchema, chapterSchema, lectureSchema } from "../validators/course.validator.js";
import { HTTPSTATUS } from "../config/http.config.js";
import {
    createTransacionService
} from "../services/transaction.service.js";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";

export const createTransaction = asyncHandler(
    async (req, res) => {
        const user = req.user
        const { courseId } = req.params
        const body = req.body


        await createTransacionService(body, courseId, user._id)


        res.sendStatus(HTTPSTATUS.CREATED)

    }
)