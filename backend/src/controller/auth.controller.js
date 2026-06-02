import { loginSchema, registerSchema } from "../validators/auth.validator.js";
import { HTTPSTATUS } from "../config/http.config.js";
import { loginService, logOutService, refreshTokenService, registerService } from "../services/auth.service.js";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";


export const signup = asyncHandler(
    async (req, res) => {

        const bodyData = { ...req.body };

        if (req.body?.instructorProfile)
            bodyData["instructorProfile"] = JSON.parse(req.body.instructorProfile)

        if (req.file?.originalname)
            bodyData["avatar"] = `http://localhost:3000/uploads/${req.file?.originalname}`

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