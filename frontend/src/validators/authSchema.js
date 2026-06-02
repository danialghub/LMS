import { z } from 'zod'

const emailSchema = z.string()
    .email('ایمیل معتبر وارد کنید')
    .min(1, 'ایمیل الزامی است')

const passwordSchema = z.string()
    .min(8, 'رمز عبور حداقل ۸ کاراکتر')
    .regex(/[A-Z]/, 'حداقل یک حرف بزرگ')
    .regex(/[a-z]/, 'حداقل یک حرف کوچک')
    .regex(/[0-9]/, 'حداقل یک عدد')
    .regex(/[@$!%*?&]/, 'حداقل یک کاراکتر ویژه (@$!%*?&)')

export const registerSchema = z.object({
    name: z.string()
        .min(3, 'نام حداقل ۳ کاراکتر باید باشد')
        .max(50, 'نام حداکثر ۵۰ کاراکتر')
        .regex(/^[\u0600-\u06FF\s]+$/, 'فقط حروف فارسی مجاز است'),
    email: emailSchema,
    password: passwordSchema
    ,
    avatar: z
        .instanceof(FileList)
        .optional()
        .refine(
            (files) => {
                if (!files || files.length === 0) return true; // اگر فایلی نبود، قبول کن
                return ['image/jpeg', 'image/png', 'image/webp'].includes(files[0]?.type);
            },
            'فرمت JPEG/PNG/WEBP مجاز است'
        ),
    instructorProfile: z.object({
        major: z.string().optional(),
        bio: z.string().optional()
    }).optional()
});

export const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema
})