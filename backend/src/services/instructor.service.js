import Course from "../Models/Course.js"
import Transaction from "../Models/Transaction.js"
import { NotFoundException, UnauthorizedException } from "../utils/app.error.js";

//course
export const getInstructorCourseService = async (instructorId, page = 1, limit = 6) => {
    const skip = (page - 1) * limit;
    console.log(page, limit);

    const totalCourses = await Course.countDocuments({
        instructor: instructorId
    });


    const instructorCourses = await Course.find({
        instructor: instructorId
    })
        .populate([
            { path: 'enrolledStudents', select: '-password' },
        ])
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

    const finalInstructorCourses = await Promise.all(instructorCourses.map(async (course) => {

        const transactions = await Transaction.find({ courseId: course._id, status: "successful" }) || [];

        const totalSales = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);

        return {
            ...course,
            sales: totalSales,
        };
    }));

    const totalPages = Math.ceil(totalCourses / limit);

    return {
        courses: finalInstructorCourses,
        totalPages,
        currentPage: page,
        hasMore: page < totalPages,
        totalCourses,
    };
}

export const getInstructorCourseByIdService = async (courseId) => {
    const course = await Course.findById(courseId);

    if (course?.courseContent?.length) {


        // مرتب‌سازی فصل‌ها
        course.courseContent.sort(
            (a, b) => (a.chapterOrder ?? 0) - (b.chapterOrder ?? 0)
        );

        // مرتب‌سازی لکچرهای هر فصل
        course.courseContent.forEach(chapter => {
            if (chapter?.chapterContent?.length) {
                chapter.chapterContent.sort(
                    (a, b) => (a.lectureOrder ?? 0) - (b.lectureOrder ?? 0)
                );
            }
        });
    }

    return course;
}

export const getAnalyticsService = async (instructorId) => {
    const courses = await Course.find({ instructor: instructorId })


    if (!courses.length)
        throw new NotFoundException("هیچ دوره ای یافت نشد")

    const analytics = await Promise.all(courses.map(async (course) => {

        const transactions = await Transaction.find({ courseId: course._id, status: "successful" }) || [];


        const totalSales = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);

        return {
            courseName: course.courseTitle,
            sales: totalSales,
            students: course.enrolledStudents.length,
        };
    }));


    if (!analytics.length) {
        throw new NotFoundException("مشکلی رخ داد")
    }

    return analytics
}