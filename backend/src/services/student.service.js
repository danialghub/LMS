import Course from "../Models/Course.js"
import Transaction from "../Models/Transaction.js"
import CourseProgress from "../Models/CourseProgress.js";
import { NotFoundException, UnauthorizedException } from "../utils/app.error.js";

//course
export const getStudentCourseService = async (studentId, filterQueries) => {

    const page = Number(filterQueries.page) || 1;
    const limit = Number(filterQueries.limit) || 6;
    const skip = (page - 1) * limit;


    let [studentCourses, totalStudentCourses] = await Promise.all([
        Course.find({ enrolledStudents: studentId })
            .populate({
                path: "instructor",
                select: "name",
            })
            .sort({ _id: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),

        Course.countDocuments({ enrolledStudents: studentId }),
    ]);



    if (!studentCourses.length) {
        throw new NotFoundException('هیچ دوره ای یافت نشد');
    }

    const courseProgresses = await CourseProgress.find({ userId: studentId });
    const progressMap = new Map(
        courseProgresses.map(cp => [cp.courseId.toString(), cp])
    );


    studentCourses = studentCourses.map(course => {
        const progress = progressMap.get(course._id.toString());
        course.courseProgress = progress || { completedLessons: [] };
        return course;
    });
    console.log(studentCourses);


    const totalPages = Math.ceil(totalStudentCourses / limit);


    return {
        courses: studentCourses,
        page,
        limit,
        totalCourses: totalStudentCourses,
        totalPages,
        hasMore: page < totalPages,
    };
}


export const markLectureAsCompletedService = async (userId, courseId, lectureId) => {
    let courseProgress = await CourseProgress.findOne({ courseId, userId })

    if (courseProgress) {
        if (courseProgress.completedLectures.includes(lectureId)) {
            throw new UnauthorizedException('این جلسه از قبل دیده شده')
        }
        courseProgress.completedLectures.push(lectureId)
        await courseProgress.save()
    } else {
        courseProgress = await CourseProgress.create({
            userId,
            courseId,
            completedLectures: [lectureId]
        })

    }

    return courseProgress;
}

export const geStudentTransactionService = async (stdId, page = 1, limit = 6) => {

    const skip = (page - 1) * limit;

    const totalTransactions = await Transaction.countDocuments({
        userId: stdId
    });


    const transactions = await Transaction.find({ userId: stdId })
        .skip(skip)
        .limit(limit)
        .populate("courseId")

    if (!transactions.length)
        throw new NotFoundException("تراکنشی یافت نشد")

  const totalPages = Math.ceil(totalTransactions / limit);

    return {
        transactions,
        totalPages,
        currentPage: page,
    };
}
export const rateToCourseService = async (courseId, userId, rating) => {
    const foundCourse = await Course.findById(courseId);

    if (!foundCourse) {
        throw new NotFoundException("دوره پیدا نشد");
    }

    const alreadyRated = foundCourse.courseRatings.find(
        item => item.userId === userId
    );

    if (alreadyRated) {
        throw new UnauthorizedException("شما یکبار امتیاز دادید");
    }

    foundCourse.courseRatings.push({
        userId,
        rating
    });

    await foundCourse.save();

    return foundCourse.courseRatings;
};