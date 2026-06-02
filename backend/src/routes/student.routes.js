

import express from 'express'

import { allowStudent, protectRoute } from '../middlewares/auth.middleware.js'
import { getCourseProgress, getStudentCourses, getStudnetCourseById, markLectureAsCompleted, rateToCourse } from '../controller/student.controller.js'


const router = express.Router()

router.use(protectRoute, allowStudent)

router.get('/courses', getStudentCourses)
router.get('/course/:courseId', getStudnetCourseById)
router.get('/course/:courseId/course-progress', getCourseProgress)
router.post('/lecture/mark-as-complete', markLectureAsCompleted)
router.post('/:courseId/rate-to-course', rateToCourse)


export default router