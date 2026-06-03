

import express from 'express'

import { allowInstructor, protectRoute } from '../middlewares/auth.middleware.js'
import { getAnalytics, getInstructorCourseById, getInstructorCourses } from '../controller/instructor.controller.js'


const router = express.Router()

router.use(protectRoute, allowInstructor)

router.get('/courses', getInstructorCourses)
router.get('/course/:courseId', getInstructorCourseById)
router.get('/courses/analytics',getAnalytics)


export default router