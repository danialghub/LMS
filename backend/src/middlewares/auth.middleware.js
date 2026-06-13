import { asyncHandler } from "./asyncHandler.middleware.js";
import { BadRequestException, NotFoundException, UnauthorizedException } from "../utils/app.error.js";
import jwt from 'jsonwebtoken'
import User from "../models/User.js";
import { Env } from '../config/ENV.config.js'
import Course from "../Models/Course.js";

export const protectRoute = asyncHandler(
    async (req, res, next) => {

        const authHeader = req.headers?.Authorization || req.headers?.authorization
        if (!authHeader)
            throw new BadRequestException("توکن بدرستی ست نشده")


        if (!authHeader.startsWith('Bearer '))
            throw new UnauthorizedException('توکن نامعتبر')
        const token = authHeader.split(' ')[1]


        jwt.verify(token, Env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
            if (err) return res.sendStatus(403)

            const userEmail = decoded.email


            if (!userEmail) throw new UnauthorizedException()

            const user = await User.findOne({ email: userEmail })


            if (!user) throw new NotFoundException()
          

            req.user = user
            next()
        })

    }
)

//فقط مدرس دوره بتواند تغییری در دوره ایجاد کند
export const courseOwner = asyncHandler(
    async (req, res, next) => {

        const authUser = req.user
        const { courseId } = req.params


        if (!authUser)
            throw new UnauthorizedException('کاربر نامعتبر')

        const course = await Course.findOne({ _id: courseId })



        if (!course)
            throw new UnauthorizedException('دوره نامعتبر')


        const isOwner = course.instructor.toString() === authUser._id.toString()

        if (!isOwner)
            throw new UnauthorizedException('مدرس دوره نامعتبر')



        req.course = course
        next()
    }
)

// فقط دانشجو
export const allowStudent = (req, res, next) => {

    if (req.user.role !== 'student') {
        return res.status(403).json({ message: 'Access denied. Students only.' });
    }
    next();
};

// فقط مدزس
export const allowInstructor = (req, res, next) => {

    if (req.user.role !== 'instructor') {
        return res.status(403).json({ message: 'Access denied. instructor only.' });
    }
    next();
};

