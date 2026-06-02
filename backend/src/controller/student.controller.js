import { HTTPSTATUS } from "../config/http.config.js";
import {
    getStudentCourseByIdService, getStudentCourseService,
    markLectureAsCompletedService,
    rateToCourseService
} from "../services/student.service.js";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";


export const getStudentCourses = asyncHandler(
    async (req, res) => {
        const studentId = req.user._id

        const instructorCourses = await getStudentCourseService(studentId)

        if (!instructorCourses.length)
            return res.sendStatus(HTTPSTATUS.BAD_REQUEST)



        res.status(HTTPSTATUS.OK).json(instructorCourses)
    }
)

export const getStudnetCourseById = asyncHandler(
    async (req, res) => {
        const { courseId } = req.params
        const userId = req.user._id

        const course = await getStudentCourseByIdService(userId, courseId)



        if (!course) {
            return res.sendStatus(HTTPSTATUS.NOT_FOUND)
        }
        res.status(HTTPSTATUS.OK).json(course)
    }
)

export const markLectureAsCompleted = asyncHandler(
    async (req, res) => {
        const { lectureId, courseId } = req.body
        const userId = req.user._id

        const courseProgress = await markLectureAsCompletedService(userId, courseId, lectureId)

        if (!courseProgress) {
            return res.sendStatus(HTTPSTATUS.BAD_REQUEST)
        }

        res.status(HTTPSTATUS.OK).json(courseProgress)
    }
)
export const getCourseProgress = asyncHandler(
    async (req, res) => {
        const { courseId } = req.params
        const userId = req.user._id

        const courseProgress = await getCourseProgressService(userId, courseId)

        res.status(HTTPSTATUS.OK).json(courseProgress)
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