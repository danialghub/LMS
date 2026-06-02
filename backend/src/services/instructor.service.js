import Course from "../Models/Course.js"
import { NotFoundException, UnauthorizedException } from "../utils/app.error.js";

//course
export const getInstructorCourseService = async (instructorId) => {

    const instructorCourses = await Course.find({
        instructor: instructorId
    }).populate([
        { path: 'enrolledStudents', select: '-password' },
    ])
        .sort({ _id: -1 });

    if (!instructorCourses.length) throw new NotFoundException('هیچ دوره ای یافت نشد')


    return instructorCourses;

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