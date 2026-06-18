import Course from "../Models/Course.js"
import Comment from "../Models/Comment.js"
import User from "../Models/User.js"
import { NotFoundException, UnauthorizedException } from "../utils/app.error.js";
import mongoose from "mongoose";

//course
export const getCourseCommentsService = async (courseId, filterQueries) => {
    const page = Number(filterQueries.page) || 1;
    const limit = Number(filterQueries.limit) || 6;
    const skip = (page - 1) * limit;

    const sortBy = filterQueries?.sortBy || "newest";
    const filter = {
        courseId,
        $or: [
            { parentId: null },
            { parentId: { $exists: false } }
        ]
    };

    if (!filterQueries?.userId) {
        filter.status = "approved";

    } else {
        const user = await User.findOne({ _id: filterQueries.userId })

        if (user && user.role === "student") {

            filter.$and = [
                {
                    $or: [
                        { parentId: null },
                        { parentId: { $exists: false } }
                    ]
                },
                {
                    $or: [
                        { status: "approved" },
                        {
                            $and: [
                                { status: "pending" },
                                { userId: filterQueries.userId }
                            ]
                        }
                    ]
                },
                {
                    courseId
                }
            ];

            delete filter.$or;
            delete filter.courseId;
            delete filter.parentId;
        }
    }

    let mainComments = [];
    let totalComments = 0;
    let totalApprovedComments = 0;

    if (sortBy === "newest" || sortBy === "oldest") {
        const sortOption = {
            createdAt: sortBy === "newest" ? -1 : 1,
        };

        [mainComments, totalComments, totalApprovedComments] = await Promise.all([
            Comment.find(filter)
                .populate({
                    path: "userId",
                    select: "-password",
                })
                .sort(sortOption)
                .skip(skip)
                .limit(limit)
                .lean(),

            Comment.countDocuments(filter),
            Comment.countDocuments({
                ...filter,
                status: "approved"
            }),
        ]);
    }
    else if (sortBy === "unApproved") {
        const CourseId = new mongoose.Types.ObjectId(courseId);
        [mainComments, totalComments, totalApprovedComments] = await Promise.all([
            Comment.aggregate([
                { $match: { ...filter, courseId: CourseId } },
                {
                    $addFields: {
                        statusPriority: {
                            $switch: {
                                branches: [
                                    { case: { $eq: ["$status", "pending"] }, then: 1 },
                                    { case: { $eq: ["$status", "approved"] }, then: 2 },
                                    { case: { $eq: ["$status", "rejected"] }, then: 3 },
                                ],
                                default: 4
                            }
                        }
                    }
                },
                {
                    $sort: {
                        statusPriority: 1,
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "user",
                    },
                },
                {
                    $unwind: "$user",
                },
                {
                    $project: {
                        "user.password": 0,
                    },
                },
                {
                    $skip: skip,
                },
                {
                    $limit: limit,
                },
            ]),
            Comment.countDocuments(filter),
            Comment.countDocuments({ ...filter, status: "approved" })
        ]);
    }

    const commentsWithReplies = await Promise.all(
        mainComments.map(async (comment) => {
            const replies = await Comment.find({
                parentId: comment._id
            })
                .sort({ updatedAt: -1 })
                .populate('userId', 'name avatar role');

            return {
                ...comment,
                replies
            };
        })
    );

    const totalPages = Math.ceil(totalComments / limit);

    return {
        comments: commentsWithReplies,
        page,
        limit,
        totalComments,
        totalApprovedComments,
        totalPages,
        hasMore: page < totalPages,
    };
}

export const postCourseCommentService = async (courseId, userId, body) => {
    const course = await Course.findById(courseId);
    const isInstructor = course.instructor.toString() === userId.toString()
    if (!course.enrolledStudents.includes(userId) && !isInstructor) {
        throw new UnauthorizedException("برای ثبت نظر باید در دوره ثبت‌نام کنید")
    }

    const { content, parentId } = body

    const comment = await Comment.create({
        courseId,
        userId,
        content,
        parentId: parentId || null,
        status: isInstructor ? "approved" : "pending"
    });


    await comment.populate('userId', 'name avatar role');

    return comment
}

export const approveCommentService = async (commentId) => {

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new NotFoundException("کامنت نامعتبر است")
    }

    comment.status = 'approved';
    await comment.save();

    return comment;

}
export const deleteCommentService = async (commentId, user) => {
    const comment = await Comment.findOne({ _id: commentId });
    if (!comment) {
        throw new NotFoundException('نظر یافت نشد');
    }

    const course = await Course.findOne({ _id: comment.courseId }).lean();
    if (!course) {
        throw new Error('دوره نامعتبر است');
    }

    const isValid =
        user._id.toString() === comment.userId.toString() ||
        course.instructor.toString() === user._id.toString();

    if (!isValid)
        throw new UnauthorizedException("شما مجاز به جذف نیستید")


    await Comment.deleteMany({ parentId: commentId });
    await comment.deleteOne();


};

export const likeCommentService = async (commentId, userId) => {
    const comment = await Comment.findOne({ _id: commentId })

    if (!comment)
        throw new NotFoundException("کامنت نامعتبر است")

    comment.dislikes = comment.dislikes.filter(userDisliked => userDisliked.toString() !== userId.toString())

    if (comment.likes.includes(userId.toString())) {
        comment.likes = comment.likes.filter(userLiked => userLiked.toString() !== userId.toString())
    } else {
        comment.likes.push(userId)
    }

    await comment.save()
}
export const disLikeCommentService = async (commentId, userId) => {
    const comment = await Comment.findOne({ _id: commentId })

    if (!comment)
        throw new NotFoundException("کامنت نامعتبر است")

    comment.likes = comment.likes.filter(userLiked => userLiked.toString() !== userId.toString())

    if (comment.dislikes.includes(userId.toString())) {
        comment.dislikes = comment.dislikes.filter(userDisliked => userDisliked.toString() !== userId.toString())
    } else {
        comment.dislikes.push(userId)
    }

    await comment.save()
}