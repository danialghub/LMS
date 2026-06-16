import { loginSchema, registerSchema, passwordSchema, instructorProfileSchema } from "../validators/auth.validator.js";
import { HTTPSTATUS } from "../config/http.config.js";
import { changePasswordService, loginService, logOutService, refreshTokenService, registerService, updateInstructorProfileService, updateProfileService } from "../services/auth.service.js";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import { uploadImage } from "../utils/helper.js";


export const signup = asyncHandler(
    async (req, res) => {

        const bodyData = { ...req.body };

        if (req.body?.instructorProfile)
            bodyData["instructorProfile"] = JSON.parse(req.body.instructorProfile)

        if (req.file?.originalname) {
            // bodyData["avatar"] = `http://localhost:3000/uploads/${req.file?.originalname}`
            const secure_url = await uploadImage(req.file.path, false)
            bodyData["avatar"] = secure_url
        }

        const body = registerSchema.safeParse(bodyData);

        if (body.success) {
            const user = await registerService(body.data);
            const role = user.role === "student" ? "دانشجو" : "مدرس"
            return res.status(HTTPSTATUS.CREATED).json({ message: `حساب ${role} با موفقیت ایجاد شد` });
        }

        res.sendStatus(HTTPSTATUS.BAD_REQUEST)

    });


export const login = asyncHandler(
    async (req, res) => {

        const body = loginSchema.safeParse(req.body);

        if (body.success) {
            const { user, accessToken } = await loginService(req, res, body.data);
            return res.status(HTTPSTATUS.OK).json(
                { user, accessToken, message: "با موفقیت وارد شدید" }
            );

        }

        res.sendStatus(HTTPSTATUS.BAD_REQUEST)


    });

export const issueRefreshToken = asyncHandler(
    async (req, res) => {
        const token = req.cookies?.jwt

        const { user, accessToken } = await refreshTokenService(res, token)

        if (user && accessToken) {
            res.status(HTTPSTATUS.OK).json({ user, accessToken })
        }
    }
)


export const logout = asyncHandler(
    async (req, res) => {

        const token = req.cookies?.jwt

        if (!token) res.sendStatus(204)

        await logOutService(res, token)

        res.status(HTTPSTATUS.OK).json({ message: "با موفقیت خارج شدید" });
    });

export const changePassword = asyncHandler(
    async (req, res) => {

        const user = req.user;
        const { oldPassword, newPassword, confirmPassword } = req.body;

        // اعتبارسنجی
        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(HTTPSTATUS.BAD_REQUEST).json({ message: 'همه فیلدها الزامی هستند' });
        }

        const result = passwordSchema.safeParse(newPassword)

        if (!result.success)
            return res.sendStatus(HTTPSTATUS.BAD_REQUEST)

        if (newPassword !== confirmPassword) {
            return res.status(HTTPSTATUS.BAD_REQUEST).json({ message: 'رمز عبور جدید و تکرار آن مطابقت ندارند' });
        }

        await changePasswordService(user, newPassword, oldPassword)
        return res.status(HTTPSTATUS.OK).json({ message: 'رمز عبور با موفقیت تغییر کرد' });


    }
)
export const updateProfile = asyncHandler(
    async (req, res) => {

        const userId = req.user.id;
        const { name } = req.body;
        const file = req.file
       

        if (!name && !file)
            return res.status(HTTPSTATUS.BAD_REQUEST).json({
                message: 'حداقل یک فیلد برای بروزرسانی ارسال کنید'
            })


        const updateData = {};


        if (name) {
            if (name.length < 3) {
                return res.status(HTTPSTATUS.BAD_REQUEST).json({
                    message: 'نام کامل حداقل ۳ کاراکتر باشد'
                });
            }
            updateData.name = name;
          
            
        }


        if (req.file) {
            const secure_url = await uploadImage(req.file.path)
            updateData.avatar = secure_url
        }


        const updatedUser = await updateProfileService(userId, updateData)

         res.status(HTTPSTATUS.OK).json({
            message: 'پروفایل با موفقیت بروزرسانی شد',
            updatedUser
        });

    }
)
export const updateInstructorProfile = asyncHandler(
    async (req, res) => {

        const userId = req.user._id;
        const { major, bio } = req.body;

        // اعتبارسنجی و اضافه کردن فیلدها
        if (!major && !bio)
            return res.status(HTTPSTATUS.BAD_REQUEST).json({
                message: 'حداقل یک فیلد برای بروزرسانی ارسال کنید'
            })

        const result = instructorProfileSchema.safeParse({ major, bio })

        if (!result.success) {
            return res.sendStatus(HTTPSTATUS.BAD_REQUEST);
        }

        const instructorProfile = await updateInstructorProfileService(userId, result.data)

        return res.status(HTTPSTATUS.OK).json({
            message: 'مشخصات مدرس با موفقیت بروزرسانی شد',
            instructorProfile
        });

    }
)