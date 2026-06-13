import Course from "../Models/Course.js"
import Comment from "../Models/Comment.js"
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

    let mainComments = [];
    let totalComments = 0;

    if (sortBy === "newest" || sortBy === "oldest") {
        const sortOption = {
            updatedAt: sortBy === "newest" ? -1 : 1,
        };

        [mainComments, totalComments] = await Promise.all([
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
        ]);
    }
    else if (sortBy === "unApproved") {
        const CourseId = new mongoose.Types.ObjectId(courseId);
        [mainComments, totalComments] = await Promise.all([
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
        ]);
        console.log(mainComments, totalComments);

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
export const deleteCommentService = async (commentId) => {

    const comment = await Comment.findById(commentId);


    if (!comment) {
        throw new NotFoundException('نظر یافت نشد')
    }

    await Comment.deleteMany({ parentId: commentId });
    await comment.deleteOne();


};