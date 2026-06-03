import Course from "../Models/Course.js"
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
        .limit(limit);
    console.log(instructorCourses);


    // محاسبه تعداد کل صفحات
    const totalPages = Math.ceil(totalCourses / limit);

    return {
        courses: instructorCourses,
        totalPages,
        currentPage: page,
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

    const analytics = courses.map(course => {
        const finalPrice = course.coursePrice - (course.coursePrice * course.courseDiscount / 100);
        const sales = course.enrolledStudents.length * finalPrice
        return {
            courseName: course.courseTitle,
            sales,
            students: course.enrolledStudents.length,
        }
    })

    if (!analytics.length) {
        throw new NotFoundException("مشکلی رخ داد")
    }

    return analytics
}