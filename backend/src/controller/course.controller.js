import { courseSchema, chapterSchema, lectureSchema } from "../validators/course.validator.js";
import { HTTPSTATUS } from "../config/http.config.js";
import {
    getCourseService, getCourseByIdService, createCourseService, patchCourseService, updateCoursePublishStatusService,
    createChapterService, patchChapterService,
    getLectureByIdService, createLectureService, patchLectureService, removeAttachmentFileService,
    updateLecturePublishStatusService, reOrderLecturesService,
    reOrderChaptersService

} from "../services/course.service.js";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import { checkFileType } from '../utils/helper.js'

export const getCourses = asyncHandler(
    async (req, res) => {
        const filters = req.query

        const {
            courses,
            page,
            limit,
            totalCourses,
            totalPages,
            hasMore
        } = await getCourseService(filters)

        if (!courses.length)
            return res.sendStatus(HTTPSTATUS.NOT_FOUND)
        
        res.status(HTTPSTATUS.OK).json({ courses, page, limit, totalCourses, totalPages, hasMore })
    }
)
export const getCourseById = asyncHandler(
    async (req, res) => {
        const { courseId } = req.params
        const { userId = "" } = req.query
        console.log("courseId", courseId, "userId", userId);

        const course = await getCourseByIdService(userId, courseId)



        if (!course) {
            return res.sendStatus(HTTPSTATUS.NOT_FOUND)
        }
        res.status(HTTPSTATUS.OK).json(course)
    }
)

export const createCourse = asyncHandler(
    async (req, res) => {
        const userId = req.user._id
        const body = courseSchema.safeParse(req.body)

        if (body.success) {
            const course = await createCourseService({ ...body.data, instructor: userId })

            return res.status(HTTPSTATUS.CREATED).json({ course, message: "با موفقیت ایجاد شد" })
        }

        res.sendStatus(HTTPSTATUS.BAD_REQUEST)
    }
)

export const patchCourseFields = asyncHandler(
    async (req, res) => {
        const { courseId } = req.params;
        const fields = req.body
        const file = req.file
        let body = fields;


        if (file && file.mimetype.startsWith('image/')) {
            body["courseThumbnail"] = `http://localhost:3000/${file.path.replace(/\\/g, '/')}`


        }
        if (file && file.mimetype.startsWith('video/')) {
            body["lectureUrl"] = `http://localhost:3000/${file.path.replace(/\\/g, '/')}`
        }
        if (body?.coursePrice) {
            body["coursePrice"] = Number(body.coursePrice)
        }
        if (body?.courseDiscount) {
            body["courseDiscount"] = Number(body.courseDiscount)
        }


        const parsedFields = courseSchema.safeParse(body)


        if (!parsedFields.success) {
            return res.sendStatus(HTTPSTATUS.BAD_REQUEST);
        }

        const updatedCourse = await patchCourseService(courseId, parsedFields.data)
        return res.status(HTTPSTATUS.OK).json({
            updatedCourse,
            message: "با موفقیت بروز شد"
        });
    }
)
export const updateCoursePublishStatus = asyncHandler(
    async (req, res) => {
        console.log('hellooo');

        const course = req.course
        console.log(course);

        const updatedCourse = await updateCoursePublishStatusService(course)

        res.status(HTTPSTATUS.OK).json({ message: "وضعیت انتشار با موفقیت بروز شد", course: updatedCourse })
    }
)

export const createChapter = asyncHandler(
    async (req, res) => {
        const course = req.course

        const body = chapterSchema.safeParse(req.body)


        if (body.success) {
            const chapter = await createChapterService(course, body.data)

            return res.status(HTTPSTATUS.CREATED).json(chapter)
        }

        res.sendStatus(HTTPSTATUS.BAD_REQUEST)
    }
)

export const getLectureById = asyncHandler(
    async (req, res) => {
        const { chapterId, lectureId } = req.params
        const course = req.course


        const lecture = await getLectureByIdService(course, chapterId, lectureId)


        if (!lecture) {
            return res.sendStatus(HTTPSTATUS.NOT_FOUND)
        }
        res.status(HTTPSTATUS.OK).json(lecture)
    }
)
export const createLecture = asyncHandler(
    async (req, res) => {
        const { chapterId } = req.params
        const course = req.course

        console.log(req.body);

        const body = lectureSchema.safeParse(req.body)


        if (body.success) {
            const lecture = await createLectureService(course, chapterId, body.data)

            return res.status(HTTPSTATUS.CREATED).json({ lecture, message: "با موفقیت ایجاد شد" })
        }

        res.sendStatus(HTTPSTATUS.BAD_REQUEST)
    }
)

export const patchChapterFields = asyncHandler(
    async (req, res) => {

        const { chapterId } = req.params;
        const course = req.course

        const fields = req.body

        let body = fields;



        const parsedFields = chapterSchema.safeParse(body)

        console.log(parsedFields);


        if (!parsedFields.success) {
            return res.sendStatus(HTTPSTATUS.BAD_REQUEST);
        }

        const updatedCourse = await patchChapterService(course, chapterId, parsedFields.data)
        return res.status(HTTPSTATUS.OK).json({
            updatedCourse,
            message: "با موفقیت بروز شد"
        });
    }
)
export const reOrderChapters = asyncHandler(
    async (req, res) => {
        const chaptetrList = req.body

        const course = req.course


        if (!chaptetrList.length)
            return res.sendStatus(HTTPSTATUS.BAD_REQUEST)

        await reOrderChaptersService(course, chaptetrList)

        res.sendStatus(HTTPSTATUS.OK)

    }
)

export const patchLectureFields = asyncHandler(
    async (req, res) => {
        const { lectureId, chapterId } = req.params;
        const course = req.course
        const fields = req.body
        const file = req.file
        let body = fields;



        if (file && file.mimetype.startsWith('video/')) {
            body["lectureUrl"] = `http://localhost:3000/${file.path.replace(/\\/g, '/')}`
        }
        else if (file) {
            const safeName = Buffer.from(file.originalname, "latin1").toString("utf8");
            let [type] = checkFileType(file);
            body["attachment"] = {
                url: `http://localhost:3000/${file.path.replace(/\\/g, '/')}`,
                name: safeName,
                fileType: type,
                size: Number(file.size)
            }
        }
        if (fields.isLectureFree !== undefined) {
            body['isLectureFree'] = fields.isLectureFree === "true"
        }


        const parsedFields = lectureSchema.safeParse(body)




        if (!parsedFields.success) {
            return res.sendStatus(HTTPSTATUS.BAD_REQUEST);
        }
        const updatedLecture = await patchLectureService(course, chapterId, lectureId, parsedFields.data)

        return res.status(HTTPSTATUS.OK).json({
            updatedLecture,
            message: "با موفقیت بروز شد"
        });
    }
)
export const updateLecturePublishStatus = asyncHandler(
    async (req, res) => {
        const course = req.course
        const { chapterId, lectureId } = req.params

        const lecture = await updateLecturePublishStatusService(course, chapterId, lectureId)

        res.status(HTTPSTATUS.OK).json({ message: "وضعیت انتشار با موفقیت بروز شد", lecture })
    }
)
export const reOrderLectures = asyncHandler(
    async (req, res) => {
        const lectureList = req.body
        const { chapterId } = req.params
        const course = req.course


        if (!lectureList.length)
            return res.sendStatus(HTTPSTATUS.BAD_REQUEST)

        await reOrderLecturesService(course, chapterId, lectureList)

        res.sendStatus(HTTPSTATUS.OK)

    }
)
export const removeAttachment = asyncHandler(
    async (req, res) => {
        const { chapterId, lectureId, courseId } = req.params

        if (!chapterId || !lectureId || !courseId)
            return res.sendStatus(HTTPSTATUS.BAD_REQUEST)

        console.log('attach');

        await removeAttachmentFileService(courseId, chapterId, lectureId)

        res.sendStatus(HTTPSTATUS.OK)
    }
)


