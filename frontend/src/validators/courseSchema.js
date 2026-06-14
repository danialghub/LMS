import { z } from "zod";

export const lectureTitleSchema = z.object({
    lectureTitle: z.string().min(1, "عنوان فصل نمیتواند خالی باشد")
})

export const lectureDurationSchema = z.string()

export const lectureUrlSchema = z.object({
    lectureUrl: z.instanceof(File, { message: "ویدئو دوره الزامیست" })
        .refine((file) => file.size <= 100 * 1024 * 1024, {
            message: "حجم ویدئو  نباید بیشتر از 100 مگابایت باشد",
        })
        .refine((file) => file.type.startsWith("video/"), {
            message: "فایل انتخابی باید از نوع ویدئو  باشد",
        }),

})
export const isLecureFreeSchema = z.object({
    isLectureFree: z.boolean()
})

export const chapterContent = z.object({
    lectureId: z.string().optional(),
    lectureOrder: z.number().optional()
})

const isArchiveFile = (file) => {
    const allowedExtensions = [".zip", ".rar", ".7z", ".tar", ".gz", ".tgz"];
    const fileName = file.name.toLowerCase();
    return allowedExtensions.some(ext => fileName.endsWith(ext));
};

export const attachmentSchema = z.object({
    attachment: z.instanceof(File, { message: "ویدئو دوره الزامیست" })
        .refine((file) => file.size <= 10 * 1024 * 1024, {
            message: "حجم فایل پیوست نباید بیشتر از 10 مگابایت باشد",
        })
        .refine((file) => {
            return isArchiveFile(file);
        }, {
            message: "فایل انتخابی باید از نوع ZIP، RAR، 7Z، TAR یا GZ باشد",
        })
})


export const courseContentSchema =
    z.object({
        chapterId: z.string().optional(),
        chapterTitle: z.string().min(1, "عنوان فصل نمیتواند خالی باشد"),
        chapterContent: z.array(chapterContent).optional()
    }).optional()

export const courseRating = z.object({
    rating: z.number().min(1).max(5)
})


const enrolledStudents = z.array(z.string()).optional()

const publishStatus = z.enum(['draft', 'incomplete', 'ready', 'published']).optional()


export const courseTitleSchema = z.object({
    courseTitle: z.string().trim().min(1, "عنوان دوره الزامیست")
})


export const courseThumbnailSchema = z.object({
    courseThumbnail: z
        .instanceof(File, { message: "پوستر دوره الزامیست" })
        .refine((file) => file.size <= 10 * 1024 * 1024, {
            message: "حجم فایل پوستر نباید بیشتر از 10 مگابایت باشد",
        })
        .refine((file) => file.type.startsWith("image/"), {
            message: "فایل انتخابی باید از نوع تصویر باشد",
        }),
});

export const courseDescriptionSchema = z.object({
    courseDescription: z.string()
        .refine(value => {

            const plainText = value
                ?.replace(/<[^>]*>/g, '')
                .replace(/&nbsp;/g, '')
                .trim() || ''

            return plainText.length > 0
        }, "توضیحات دوره نمی‌تواند خالی باشد")
})
export const coursePriceSchema = z.object({
    coursePrice: z.number({
        required_error: "قیمت دوره الزامی است",
        invalid_type_error: "قیمت دوره باید یک عدد باشد، نه رشته"
    }).min(0, "قیمت دوره نمی‌تواند منفی باشد")
})

export const courseDiscountSchema = z.object({
    courseDiscount: z.number({
        required_error: "درصد تخفیف الزامی است",
        invalid_type_error: "درصد تخفیف باید یک عدد باشد"
    }).min(0, "درصد تخفیف نمی‌تواند کمتر از ۰ باشد")
        .max(100, "درصد تخفیف نمی‌تواند بیشتر از ۱۰۰ باشد")
})

export const courseSchema = z.object({
    isCoursePublished: z.boolean().optional(),
    instructor: z.string().optional(),
    enrolledStudents,
    publishStatus
});