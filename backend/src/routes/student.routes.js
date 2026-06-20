import express from 'express'

import { allowStudent, protectRoute } from '../middlewares/auth.middleware.js'
import { geStudentTransaction, getStudentCourses, markLectureAsCompleted, rateToCourse } from '../controller/student.controller.js'


const router = express.Router()

router.use(protectRoute, allowStudent)

router.get('/courses', getStudentCourses)
router.get('/transactions', geStudentTransaction)
router.post('/lecture/mark-as-complete', markLectureAsCompleted)
router.post('/:courseId/rate-to-course', rateToCourse)


export default router