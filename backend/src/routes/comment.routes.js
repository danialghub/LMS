// routes/commentRoutes.js
import express from 'express';
import {
    getCourseComments,
    deleteComment,
    toggleReaction,
    approveComment,
    postCourseComment
} from "../controller/comment.controller.js";
import { protectRoute, allowInstructor, courseOwner } from '../middlewares/auth.middleware.js';

const router = express.Router();


router.get('/:courseId/all', getCourseComments);

router.use(protectRoute)

router.post('/:courseId/post', postCourseComment);
router.delete('/:courseId/:commentId/remove', allowInstructor, courseOwner, deleteComment);
router.put('/:courseId/:commentId/approve', allowInstructor, courseOwner, approveComment);
// router.post('/:courseId/comments/:commentId/reaction', protect, toggleReaction);

export default router;