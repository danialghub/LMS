import Course from "../Models/Course.js"
import Transaction from "../Models/Transaction.js"
import CourseProgress from "../Models/CourseProgress.js";
import { NotFoundException, UnauthorizedException } from "../utils/app.error.js";

//course
export const getStudentCourseService = async (studentId,filterQueries) => {

    const page = Number(filterQueries.page) || 1;
    const limit = Number(filterQueries.limit) || 12;
    const skip = (page - 1) * limit;


    let studentCourses = await Course.find({
        enrolledStudents: studentId
    })
        .populate([
            { path: 'instructor', select: '-password' },
        ])
        .sort({ _id: -1 });


          [courses, totalCourses] = await Promise.all([
                    Course.find(query)
                        .select("-courseContent")
                        .populate({
                            path: "instructor",
                            select: "-password",
                        })
                        .sort(sortOption)
                        .skip(skip)
                        .limit(limit)
                        .lean(),
        
                    Course.countDocuments(query),
                ]);
                

    if (!studentCourses.length) {
        throw new NotFoundException('هیچ دوره ای یافت نشد');
    }

    const courseProgresses = await CourseProgress.find({ userId: studentId });
    const progressMap = new Map(
        courseProgresses.map(cp => [cp.courseId.toString(), cp])
    );

    // تبدیل به آرایه جدید با آبجکت‌های ساده
    studentCourses = studentCourses.map(course => {
        const courseObj = course.toObject(); // تبدیل هر کدام جداگانه
        const progress = progressMap.get(courseObj._id.toString());
        courseObj.courseProgress = progress || { completedLessons: [] };
        return courseObj;
    });

    return studentCourses;
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

export const geStudentTransactionService = async (stdId) => {

    const transactions = await Transaction.find({ userId: stdId }).populate("courseId")

    if (!transactions.length)
        throw new NotFoundException("تراکنشی یافت نشد")

    return transactions
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