// routes/commentRoutes.js
import express from 'express';
import {
    getCourseComments,
    deleteComment,
    approveComment,
    postCourseComment,
    disLikeComment,
    likeComment
} from "../controller/comment.controller.js";
import { protectRoute, allowInstructor, courseOwner } from '../middlewares/auth.middleware.js';

const router = express.Router();


router.get('/:courseId/all', getCourseComments);

router.use(protectRoute)

router.post('/:courseId/post', postCourseComment);
router.delete('/:courseId/:commentId/remove', deleteComment);
router.put('/:courseId/:commentId/approve', allowInstructor, courseOwner, approveComment);
router.patch('/:courseId/:commentId/like', likeComment);
router.patch('/:courseId/:commentId/dislike', disLikeComment);
// router.post('/:courseId/comments/:commentId/reaction', protect, toggleReaction);

export default router;