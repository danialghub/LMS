

import express from 'express'

import { allowInstructor, protectRoute } from '../middlewares/auth.middleware.js'
import { getInstructorCourseById, getInstructorCourses } from '../controller/instructor.controller.js'


const router = express.Router()

router.use(protectRoute, allowInstructor)

router.get('/courses', getInstructorCourses)
router.get('/course/:courseId', getInstructorCourseById)



export default router