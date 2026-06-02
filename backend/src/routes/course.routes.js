

import express from 'express'
import {
    getCourses, createCourse, patchCourseFields, getCourseById,
    createChapter, patchChapterFields, createLecture, patchLectureFields,
    getLectureById,
    removeAttachment,
    updateLecturePublishStatus,
    updateCoursePublishStatus,
    reOrderLectures,
    reOrderChapters,
} from '../controller/course.controller.js'
import { allowInstructor, protectRoute, courseOwner } from '../middlewares/auth.middleware.js'
import { upload } from '../config/multer.js'
import { createTransaction } from '../controller/transaction.controller.js'

const router = express.Router()

//public routes
router.get('/courses', getCourses)
router.get('/:courseId', getCourseById)


//private routes
router.use(protectRoute, allowInstructor)

router.post('/create', createCourse)


//فقط مدرس دوره میتواند تغییرات ایجاد کند در دوره
router.use('/:courseId', courseOwner)

router.patch('/:courseId/update', upload.single('file'), patchCourseFields)

router.patch('/:courseId/publish', updateCoursePublishStatus)
router.patch('/:courseId/chapter/reorder', reOrderChapters)
//chapter
router.post('/:courseId/chapter', createChapter)
router.patch('/:courseId/chapter/:chapterId', patchChapterFields)
router.patch('/:courseId/chapter/:chapterId/lecture/reorder', reOrderLectures)
//lecture
router.get('/:courseId/chapter/:chapterId/lecture/:lectureId', getLectureById)
router.post('/:courseId/chapter/:chapterId/lecture', createLecture)
router.patch('/:courseId/chapter/:chapterId/lecture/:lectureId', upload.single('file'), patchLectureFields)
router.patch('/:courseId/chapter/:chapterId/lecture/:lectureId/publish', updateLecturePublishStatus)
router.delete('/:courseId/chapter/:chapterId/lecture/:lectureId', removeAttachment)

export default router