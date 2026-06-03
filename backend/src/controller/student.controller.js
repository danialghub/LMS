import { HTTPSTATUS } from "../config/http.config.js";
import {
    getStudentCourseService,
    markLectureAsCompletedService,
    rateToCourseService,
    geStudentTransactionService
} from "../services/student.service.js";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";


export const getStudentCourses = asyncHandler(
    async (req, res) => {
        const studentId = req.user._id

        const studentCourses = await getStudentCourseService(studentId)

        if (!studentCourses.length)
            return res.sendStatus(HTTPSTATUS.BAD_REQUEST)



        res.status(HTTPSTATUS.OK).json(studentCourses)
    }
)


export const markLectureAsCompleted = asyncHandler(
    async (req, res) => {
        const { lectureId, courseId } = req.body
        const userId = req.user._id
        console.log(lectureId, courseId);

        const courseProgress = await markLectureAsCompletedService(userId, courseId, lectureId)

        if (!courseProgress) {
            return res.sendStatus(HTTPSTATUS.BAD_REQUEST)
        }

        res.status(HTTPSTATUS.OK).json(courseProgress)
    }
)

export const geStudentTransaction = asyncHandler(
    async (req, res) => {
        const studentId = req.user._id

        const transactions = await geStudentTransactionService(studentId)

        res.status(HTTPSTATUS.OK).json(transactions)
    }
)

export const rateToCourse = asyncHandler(
    async (req, res) => {
        const { rating } = req.body
        const userId = req.user._id
        const { courseId } = req.params
        if (!rating)
            return res.sendStatus(HTTPSTATUS.BAD_REQUEST)

        const courseRating = await rateToCourseService(courseId, userId, rating)

        res.status(HTTPSTATUS.OK).json(courseRating)
    }
)
