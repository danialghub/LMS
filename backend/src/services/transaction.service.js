import { Env } from "../config/ENV.config.js";
import { HTTPSTATUS } from "../config/http.config.js";
import Course from "../Models/Course.js"
import Transaction from "../Models/Transaction.js"
import axios from 'axios'
import { UnauthorizedException } from "../utils/app.error.js";


export const requestZarinPalService = async (userId, courseId) => {
    // اعتبارسنجی ورودی‌ها
    if (!userId || !courseId) {
        throw new Error('اطلاعات کاربر و دوره الزامی است'); // استفاده از Error معمولی به جای UnauthorizedException
    }

    // پیدا کردن دوره
    const course = await Course.findById(courseId);
    if (!course) {
        throw new Error('دوره نامعتبر است');
    }
    const foundTransaction = await Transaction.findOne({ userId, courseId })
    const hasEnrolled = course.enrolledStudents.some(user => user.toString() === userId.toString())

    if (foundTransaction && foundTransaction.status === "successful" && hasEnrolled) {
        throw new UnauthorizedException("شما یک بار این دوره را خریداری کردید")
    } else if (foundTransaction && foundTransaction.status === "pending") {
        foundTransaction.status = "failed"
    }
    // محاسبه مبلغ نهایی با احتساب تخفیف
    const discountAmount = (course.coursePrice * course.courseDiscount) / 100;
    const amount = Math.round(course.coursePrice - discountAmount); // round برای جلوگیری از اعشار


    // اعتبارسنجی مبلغ
    if (amount <= 0) {
        if (course.enrolledStudents.includes(userId)) {
            throw new UnauthorizedException("شما یکبار در دوره ثبت نام کردید")
        } else {
            let updatedCourse = await Course.findByIdAndUpdate(courseId, {
                $addToSet: { enrolledStudents: userId },
            }, { timestamps: false, returnDocument: "after" });
            updatedCourse = await updatedCourse.populate("instructor", "-password")
            return { isEnrolledForFree: true, course: updatedCourse }
        }
    } else {
        const baseUrl = Env.NODE_ENV === "development" ? `http://localhost:${Env.PORT}` : Env.FRONTEND_ORIGIN
        // داده‌های درخواست به زرین‌پال
        const paymentData = {
            merchant_id: Env.MERCHANT_ID,
            amount: amount,
            description: course.courseTitle || `پرداخت دوره با شناسه ${courseId}`,
            callback_url: `${baseUrl}/api/transaction/verify`, 
            currency: "IRT"
        };


        try {
            // ارسال درخواست به زرین‌پال
            const response = await axios.post(
                'https://sandbox.zarinpal.com/pg/v4/payment/request.json',
                paymentData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },

                }
            );

            // بررسی موفقیت آمیز بودن درخواست
            if (response.data?.data?.code === 100 && response.data?.data?.authority) {
                const authority = response.data.data.authority;

                // ایجاد تراکنش جدید
                const transaction = new Transaction({
                    userId,
                    courseId,
                    authority,
                    amount,
                    status: 'pending',
                    paymentData: {
                        requestData: paymentData,
                        zarinpalResponse: response.data
                    },


                });

                await transaction.save();


                return {
                    status: "OK", // استفاده از success به جای status
                    authority,
                    transactionId: transaction._id,
                    paymentUrl: `https://sandbox.zarinpal.com/pg/StartPay/${authority}`,
                    amount
                };
            } else {
                // خطای برگشتی از زرین‌پال
                const errorMessage = response.data?.data?.message || 'خطا در ایجاد تراکنش';


                return {
                    status: "failed",
                    message: errorMessage,
                    code: response.data?.data?.code
                };

            }
        } catch (error) {
            // مدیریت خطاهای شبکه و سرور

            if (error.code === 'ECONNABORTED') {
                throw new Error('ارتباط با درگاه پرداخت با خطا مواجه شد (timeout)');
            }

            throw new Error(`خطا در ارتباط با زرین‌پال: ${error.message}`);
        }
    }

};
export const verifyZarinPalService = async (Authority, Status) => {

    // در کنترلر پرداخت

    if (Status !== 'OK') {
        await Transaction.findOneAndUpdate(
            { authority: Authority },
            { status: 'failed' }
        );


        return { status: "failed" }

    }

    const transaction = await Transaction.findOne({ authority: Authority });
    const foundCourse = await Course.findById({ _id: transaction.courseId });

    if (!transaction) {

        return { status: "failed" }
    }

    if (!foundCourse) {
        return { status: "failed" }
    }

    const verifyData = {
        merchant_id: Env.MERCHANT_ID,
        amount: transaction.amount,
        authority: Authority
    };

    const response = await axios.post('https://sandbox.zarinpal.com/pg/v4/payment/verify.json',
        verifyData
    );

    if (response.data.data.code === 100) {
        const refId = response.data.data.ref_id;
        const cardNumber = response.data.data.card_pan || 'نامشخص';

        transaction.status = 'successful';
        transaction.verifiedAt = new Date();
        transaction.paymentData = {
            ...transaction.paymentData,
            verifyResponse: response.data
        };


        await transaction.save();
        await Course.findByIdAndUpdate(transaction.courseId, {
            $addToSet: { enrolledStudents: transaction.userId },
        }, { timestamps: false });


        return { status: "OK", refId, amount: transaction.amount, cardNumber, courseId: foundCourse._id }

    } else if (response.data.data.code === 101) {
        // تراکنش قبلاً تایید شده
        return { status: "already_verified" }

    } else {
        transaction.status = 'failed';
        await transaction.save();

        // ری‌دایرکت به فرانت با وضعیت failed


        return { status: "failed", code: response.data.data.code }
    }



}