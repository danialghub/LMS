import { HTTPSTATUS } from "../config/http.config.js";
import {
    getInstructorCourseByIdService, getInstructorCourseService, getAnalyticsService

} from "../services/instructor.service.js";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";


export const getInstructorCourses = asyncHandler(
    async (req, res) => {
        const instructorId = req.user._id
        const { page, limit } = req.query

        const instructorCourses = await getInstructorCourseService(instructorId, Number(page), Number(limit))

        if (!instructorCourses.courses.length)
            return res.sendStatus(HTTPSTATUS.BAD_REQUEST)



        res.status(HTTPSTATUS.OK).json(instructorCourses)
    }
)

export const getInstructorCourseById = asyncHandler(
    async (req, res) => {
        const { courseId } = req.params

        const course = await getInstructorCourseByIdService(courseId)



        if (!course) {
            return res.sendStatus(HTTPSTATUS.NOT_FOUND)
        }
        res.status(HTTPSTATUS.OK).json(course)
    }
)

export const getAnalytics = asyncHandler(
    async (req, res) => {
        const instrutorId = req.user._id

        const analytics = await getAnalyticsService(instrutorId)

        res.status(HTTPSTATUS.OK).json(analytics)
    }
)