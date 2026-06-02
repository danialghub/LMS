import { HTTPSTATUS } from "../config/http.config.js";
import {
    getInstructorCourseByIdService, getInstructorCourseService

} from "../services/instructor.service.js";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";


export const getInstructorCourses = asyncHandler(
    async (req, res) => {
        const instructorId = req.user._id

        const instructorCourses = await getInstructorCourseService(instructorId)

        if (!instructorCourses.length)
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