// controllers/commentController.js
import Comment from '../Models/Comment.js';
import Course from '../Models/Course.js';
import { approveCommentService, getCourseCommentsService, postCourseCommentService } from '../services/comment.service.js';
import { asyncHandler } from '../middlewares/asyncHandler.middleware.js'
import { HTTPSTATUS } from '../config/http.config.js';

// دریافت نظرات یک دوره
export const getCourseComments = asyncHandler(
    async (req, res) => {
        const { courseId } = req.params;
        const filterQueries = req.query;

        const data = await getCourseCommentsService(courseId, filterQueries)

        res.status(HTTPSTATUS.OK).json(data);

    }
)

// ثبت نظر جدید
export const postCourseComment = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user._id;



        const comment = await postCourseCommentService(courseId, userId, req.body)

        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// حذف نظر
export const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user._id;
        const userRole = req.user.role;

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ error: 'نظر یافت نشد' });
        }

        // فقط نویسنده یا ادمین/مدرس می‌تواند حذف کند
        if (comment.userId.toString() !== userId.toString() &&
            userRole !== 'admin' && userRole !== 'instructor') {
            return res.status(403).json({ error: 'شما اجازه حذف این نظر را ندارید' });
        }

        // حذف همه پاسخ‌ها
        await Comment.deleteMany({ parentId: commentId });
        await comment.deleteOne();

        res.json({ message: 'نظر با موفقیت حذف شد' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// لایک/دیسلایک
export const toggleReaction = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { type } = req.body; // 'like' or 'dislike'
        const userId = req.user._id;

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ error: 'نظر یافت نشد' });
        }

        // مدیریت لایک
        if (type === 'like') {
            const likedIndex = comment.likes.indexOf(userId);
            const dislikedIndex = comment.dislikes.indexOf(userId);

            if (likedIndex !== -1) {
                // اگه قبلاً لایک کرده بود، لایک رو بردار
                comment.likes.splice(likedIndex, 1);
            } else {
                // لایک جدید
                comment.likes.push(userId);
                // اگه دیسلایک کرده بود، دیسلایک رو بردار
                if (dislikedIndex !== -1) {
                    comment.dislikes.splice(dislikedIndex, 1);
                }
            }
        }
        // مدیریت دیسلایک
        else if (type === 'dislike') {
            const dislikedIndex = comment.dislikes.indexOf(userId);
            const likedIndex = comment.likes.indexOf(userId);

            if (dislikedIndex !== -1) {
                // اگه قبلاً دیسلایک کرده بود، دیسلایک رو بردار
                comment.dislikes.splice(dislikedIndex, 1);
            } else {
                // دیسلایک جدید
                comment.dislikes.push(userId);
                // اگه لایک کرده بود، لایک رو بردار
                if (likedIndex !== -1) {
                    comment.likes.splice(likedIndex, 1);
                }
            }
        }

        await comment.save();

        res.json({
            likes: comment.likes.length,
            dislikes: comment.dislikes.length
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const approveComment = asyncHandler(
    async (req, res) => {

        const { commentId } = req.params;

        const comment = await approveCommentService(commentId)

        res.json(comment);


    }
);