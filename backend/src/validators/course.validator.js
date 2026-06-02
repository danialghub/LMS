import { z } from "zod";

export const lectureSchema = z.object({
    lectureId: z.string().optional(),
    lectureTitle: z.string().optional(),
    lectureDuration: z.string().optional(),
    lectureUrl: z.string().optional(),
    isLectureFree: z.boolean().optional(),
    lectureOrder: z.number().optional(),
    attachment: z.object({
        url: z.string(),
        name: z.string(),
        size: z.number(),
        fileType: z.string()
    }).optional()
})

export const chapterSchema = z.object({
    chapterId: z.string().optional(),
    chapterTitle: z.string().optional(),
    chapterOrder: z.number().optional(),
    chapterContent: z.array(lectureSchema).optional()
})

const courseRatings = z.array(
    z.object({
        userId: z.string(),
        rating: z.number().min(1).max(5)
    })
).optional()

const enrolledStudents = z.array(z.string()).optional()

const publishStatus = z.enum(['draft', 'incomplete', 'ready', 'published']).optional()

export const courseSchema = z.object({
    courseTitle: z.string().trim().min(1, "عنوان دوره الزامیست").optional(),
    courseDescription: z.string().trim().optional(),
    coursePrice: z.number().optional(),
    courseDiscount: z.number().min(0).max(100).optional(),
    isCoursePublished: z.boolean().optional(),
    courseThumbnail: z.string().optional(),
    courseContent: z.array(chapterSchema).optional(),
    courseRatings,
    instructor: z.string().optional(),
    enrolledStudents,
});