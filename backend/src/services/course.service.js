import Course from "../Models/Course.js"
import CourseProgress from "../Models/CourseProgress.js";
import { NotFoundException, UnauthorizedException } from "../utils/app.error.js";

//course
export const getCourseService = async (filterQueries = {}) => {
    const page = Number(filterQueries.page) || 1;
    const limit = Number(filterQueries.limit) || 12;
    const skip = (page - 1) * limit;

    const query = {
        isCoursePublished: true,
    };

    const sortBy = filterQueries?.sortBy || "newest";
    console.log(sortBy);


    let courses = [];
    let totalCourses = 0;

    // Sort های ساده
    if (sortBy === "newest" || sortBy === "oldest") {
        const sortOption = {
            updatedAt: sortBy === "newest" ? -1 : 1,
        };

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
    }

    // Sort های محاسباتی
    else {
        let addFields = {};
        let sortStage = {};

        if (sortBy === "most-popular") {
            addFields = {
                averageRating: {
                    $ifNull: [
                        { $avg: "$courseRatings.rating" },
                        0,
                    ],
                },
            };

            sortStage = {
                averageRating: -1,
            };
        }

        else if (sortBy === "most-sell") {
            addFields = {
                totalSales: {
                    $size: {
                        $ifNull: ["$enrolledStudents", []],
                    },
                },
            };

            sortStage = {
                totalSales: -1,
            };
        }

        else {
            throw new BadRequestException("sortBy نامعتبر است");
        }

        [courses, totalCourses] = await Promise.all([
            Course.aggregate([
                { $match: query },

                {
                    $addFields: addFields,
                },

                {
                    $sort: sortStage,
                },

                {
                    $lookup: {
                        from: "users",
                        localField: "instructor",
                        foreignField: "_id",
                        as: "instructor",
                    },
                },

                {
                    $unwind: "$instructor",
                },

                {
                    $project: {
                        courseContent: 0,
                        "instructor.password": 0,
                    },
                },

                {
                    $skip: skip,
                },

                {
                    $limit: limit,
                },
            ]),

            Course.countDocuments(query),
        ]);
    }

    if (courses.length === 0 && page === 1) {
        throw new NotFoundException("هیچ دوره‌ای یافت نشد");
    }

    const totalPages = Math.ceil(totalCourses / limit);

    return {
        courses,
        page,
        limit,
        totalCourses,
        totalPages,
        hasMore: page < totalPages,
    };
};

export const getCourseByIdService = async (userId, courseId) => {
    let course;
    let studentCourse;
    if (userId) {
        studentCourse = await Course.findOne({
            _id: courseId,
            enrolledStudents: userId
        })
            .populate({
                path: "instructor",
                select: "-password",
            });
    }

    if (studentCourse) {
        course = studentCourse.toObject();
        let courseProgress = await CourseProgress.findOne({
            courseId: courseId,
            userId: userId
        });
        course.courseProgress = courseProgress || {
            completedLessons: [],
        };

    } else {
        course = await Course.findById(courseId)
            .populate([
                { path: 'instructor', select: '-password' },
            ])

        course.courseContent.forEach(ch => ch.chapterContent.forEach(lec => {
            if (!lec.isLectureFree) {
                lec.lectureUrl = "";
            }
        }))

    }

    if (!course) {
        throw new NotFoundException('دوره یافت نشد یا شما در این دوره ثبت‌نام نکرده‌اید');
    }


    if (course?.courseContent?.length) {

        course.courseContent.sort(
            (a, b) => (a.chapterOrder ?? 0) - (b.chapterOrder ?? 0)
        );

        course.courseContent.forEach(chapter => {
            if (chapter?.chapterContent?.length) {
                chapter.chapterContent.sort(
                    (a, b) => (a.lectureOrder ?? 0) - (b.lectureOrder ?? 0)
                );
            }
            chapter.chapterContent = chapter.chapterContent.filter(lec => lec.isLecturePublished)
        });
    }
console.log(userId);

    return course;
}

export const createCourseService = async (body) => {

    const course = await Course.create(body)

    return course
}

export const patchCourseService = async (courseId, fields) => {

    const forbiddenFields = ['_id', '__v', 'createdAt', 'updatedAt'];
    forbiddenFields.forEach(field => {
        delete fields[field];
    });


    const existCourse = await Course.findOne({ _id: courseId })

    if (!existCourse) throw new NotFoundException('همچین دوره ای وجود ندارد')

    const course = await Course.findByIdAndUpdate(
        courseId,
        { $set: fields },
        {
            returnDocument: 'after',
            runValidators: true
        }
    );


    return course;
}
export const updateCoursePublishStatusService = async (course) => {
    if (course.coursePublishStatus === "draft" && !course.isCoursePublished) {

        const hasAtLeastOnePublishedLecture = course.courseContent.some(ch => ch.chapterContent.some(lec => lec.isLecturePublished))

        const requiredFields = [
            course.courseTitle,
            course.courseDescription,
            course.coursePrice,
            course.courseDiscount,
            course.courseThumbnail,
            hasAtLeastOnePublishedLecture
        ]
        const areFieldsCompleted = requiredFields.every(field => Boolean(field));
        if (!areFieldsCompleted)
            throw new UnauthorizedException('شما مجاز به انتشار دوره تا زمان پر شدن فیلد های اجباری نمیباشید')

        course.coursePublishStatus = "published"
        course.isCoursePublished = true
    } else {
        course.coursePublishStatus = "draft"
        course.isCoursePublished = false
    }
    await course.save()

    return course
}
//chapter
export const createChapterService = async (course, body) => {

    const chapter = {
        chapterId: body.chapterId || new mongoose.Types.ObjectId(),
        chapterTitle: body.chapterTitle,
        chapterOrder: course.courseContent ? course.courseContent.length + 1 : 1,
        chapterContent: []
    }
    course.courseContent.push(chapter)
    await course.save()

    return chapter
}

export const patchChapterService = async (courseId, chapterId, fields) => {
    const forbiddenFields = ['chapterId', '__v', 'createdAt', 'updatedAt'];
    forbiddenFields.forEach(field => delete fields[field]);


    // ساخت داینامیک آبجکت برای آپدیت فیلدها
    const updateObject = {};
    Object.keys(fields).forEach(key => {
        updateObject[`courseContent.$.${key}`] = fields[key];
    });

    const updatedCourse = await Course.findOneAndUpdate(
        {
            _id: courseId,
            'courseContent.chapterId': chapterId
        },
        { $set: updateObject },
        { returnDocument: 'after' }
    );

    const updatedChapter = updatedCourse.courseContent.find(ch => ch.chapterId === chapterId);
    return updatedChapter;
}

export const reOrderChaptersService = async (course, chapterList) => {

    let chapters = course.courseContent

    for (const item of chapterList) {
        const chapter = chapters.find(
            ch => ch.chapterId === item.chapterId
        );

        if (chapter) {
            chapter.chapterOrder = item.position;
        }
    }

    await course.save()

}

//lecture
export const getLectureByIdService = async (course, chapterId, lectureId) => {
    const chapter = course.courseContent.find(ch => ch.chapterId === chapterId)
    if (!chapter)
        throw new NotFoundException('همجین فصلی وجود ندارد')

    const lecture = chapter.chapterContent.find(lec => lec.lectureId === lectureId)
    if (!lecture)
        throw new NotFoundException('همجین جلسه ای وجود ندارد')


    return lecture;
}
export const createLectureService = async (course, chapterId, body) => {
    const chapter = course.courseContent.find(
        ch => ch.chapterId === chapterId
    );


    if (!chapter) throw new NotFoundException('همچین فصلی وجود ندارد');

    const lecture = {
        lectureId: body.lectureId || new mongoose.Types.ObjectId(),
        lectureTitle: body.lectureTitle,
        lectureOrder: chapter.chapterContent ? chapter.chapterContent.length + 1 : 1,
    };

    chapter.chapterContent.push(lecture);

    await course.save();
    return lecture;
};

export const patchLectureService = async (courseId, chapterId, lectureId, fields) => {
    const forbiddenFields = ['lectureId', '__v', 'createdAt', 'updatedAt'];
    forbiddenFields.forEach(field => delete fields[field]);


    const updatedCourse = await Course.findOneAndUpdate(
        {
            _id: courseId,
            'courseContent.chapterId': chapterId,
            'courseContent.chapterContent.lectureId': lectureId
        },
        {
            $set: Object.keys(fields).reduce((acc, key) => {
                acc[`courseContent.$[chapter].chapterContent.$[lecture].${key}`] = fields[key];
                return acc;
            }, {})
        },
        {
            arrayFilters: [
                { 'chapter.chapterId': chapterId },
                { 'lecture.lectureId': lectureId }
            ],
            returnDocument: "after"
        }
    );

    // پیدا کردن lecture آپدیت شده برای بازگشت
    const chapter = updatedCourse.courseContent.find(ch => ch.chapterId === chapterId);
    const updatedLecture = chapter.chapterContent.find(lec => lec.lectureId === lectureId);

    return updatedLecture;
}
export const updateLecturePublishStatusService = async (course, chapterId, lectureId) => {

    const chapter = course.courseContent.find(ch => ch.chapterId === chapterId)
    const lecture = chapter.chapterContent.find(lec => lec.lectureId === lectureId)

    if (lecture.lecturePublishStatus === "draft" && !lecture.isLecturePublished) {

        const requiredFields = [
            lecture.lectureTitle,
            lecture.lectureUrl,
            typeof lecture.isLectureFree === 'boolean',
        ]
        const areFieldsCompleted = requiredFields.every(field => Boolean(field));
        if (!areFieldsCompleted)
            throw new UnauthorizedException('شما مجاز به انتشار جلسه تا زمان پر شدن فیلد های اجباری نمیباشید')

        lecture.lecturePublishStatus = "published"
        lecture.isLecturePublished = true
    } else {
        lecture.lecturePublishStatus = "draft"
        lecture.isLecturePublished = false
    }
    await course.save()

    return lecture

}
export const reOrderLecturesService = async (course, chapterId, lectureList) => {
    const chapter = course.courseContent.find(
        ch => ch.chapterId === chapterId
    );

    if (chapter) {
        for (const item of lectureList) {
            const lecture = chapter.chapterContent.find(
                lec => lec.lectureId === item.lectureId
            );

            if (lecture) {
                lecture.lectureOrder = item.position;
            }
        }
    }

    await course.save();

}

export const removeAttachmentFileService = async (courseId, chapterId, lectureId) => {

    const updatedCourse = await Course.findOneAndUpdate(
        {
            _id: courseId,
            'courseContent.chapterId': chapterId,
            'courseContent.chapterContent.lectureId': lectureId
        },
        {
            $unset: {
                'courseContent.$[chapter].chapterContent.$[lecture].attachment': ""
            }
        },
        {
            arrayFilters: [
                { 'chapter.chapterId': chapterId },
                { 'lecture.lectureId': lectureId }
            ],
            returnDocument: "after"
        }
    );

};

