import Course from "../Models/Course.js"
import CourseProgress from "../Models/CourseProgress.js";
import { NotFoundException, UnauthorizedException } from "../utils/app.error.js";

//course
export const getStudentCourseService = async (studentId) => {
    let studentCourses = await Course.find({
        enrolledStudents: studentId
    }).populate([
        { path: 'enrolledStudents', select: '-password' },
    ])
        .sort({ _id: -1 });

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

export const getStudentCourseByIdService = async (userId, courseId) => {
    // 1. پیدا کردن دوره همراه با بررسی ثبت‌نام
    let studentCourse = await Course.findOne({
        _id: courseId,
        enrolledStudents: userId  // مهم: بررسی ثبت‌نام کاربر
    });

    if (!studentCourse) {
        throw new NotFoundException('دوره یافت نشد یا شما در این دوره ثبت‌نام نکرده‌اید');
    }

    // 2. تبدیل به آبجکت ساده
    let course = studentCourse.toObject();

    // 3. مرتب‌سازی محتوای دوره
    if (course?.courseContent?.length) {
        // مرتب‌سازی فصل‌ها
        course.courseContent.sort(
            (a, b) => (a.chapterOrder ?? 0) - (b.chapterOrder ?? 0)
        );

        // مرتب‌سازی جلسات هر فصل
        course.courseContent.forEach(chapter => {
            if (chapter?.chapterContent?.length) {
                chapter.chapterContent.sort(
                    (a, b) => (a.lectureOrder ?? 0) - (b.lectureOrder ?? 0)
                );
            }
        });
    }

    // 4. پیدا کردن پیشرفت کاربر
    let courseProgress = await CourseProgress.findOne({
        courseId: courseId,
        userId: userId
    });

    // 5. اضافه کردن اطلاعات پیشرفت به دوره
    course.courseProgress = courseProgress || {
        completedLessons: [],
    };

    return course;
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

export const getCourseProgressService = async (userId, courseId) => {
    const courseProgress = await CourseProgress.findOne({ courseId, userId })

    if (!courseProgress) {
        throw new NotFoundException('پیشرفت دوره پیدا نشد')
    }

    return courseProgress
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