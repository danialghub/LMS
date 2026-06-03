import Course from "../Models/Course.js"
import cron from 'node-cron'
import Transaction from "../Models/Transaction.js"
import { NotFoundException, UnauthorizedException } from "../utils/app.error.js";


cron.schedule('* * * * *', async () => {
    const threeMinutesAgo = new Date(Date.now() - 3 * 60 * 1000)

    await Transaction.updateMany(
        {
            status: 'progressing',
            createdAt: { $lte: threeMinutesAgo }
        },
        {
            $set: { status: 'failed' }
        }
    )
})

export const createTransacionService = async (courseId, userId) => {

    const course = await Course.findOne({ _id: courseId })

    if (!course)
        throw new NotFoundException('همچین دوره ای وجود ندارد')

    const foundTransaction = await Transaction.findOne({ userId, courseId, status: "successful" })
    const foundEnrolledUser = course.enrolledStudents.some(std => std.toString() === userId.toString())

    if (foundTransaction || foundEnrolledUser)
        throw new UnauthorizedException('شما یکبار این دوره را خریداری کردید')


    const transaction = {
        userId,
        courseId,
        value: course.coursePrice - (course.coursePrice * course.courseDiscount / 100),
        status: "progressing"
    }
    const newTransaction = await Transaction.create(transaction)



    return newTransaction
}
export const updateTransactionStatusService = async (cardInfo, courseId, userId) => {

    const dummyCardInfo = {
        cardNumber: "1111111111111111",
        cvv2: "1111",
        expireMonth: '12',
        expireYear: "04"
    }

    const course = await Course.findOne({ _id: courseId })
    if (!course)
        throw new NotFoundException('همچین دوره ای وجود ندارد')

    const foundTransaction = await Transaction.findOne({ userId, courseId, status: "progressing" })
    const foundFailedTransaction = await Transaction.findOne({ userId, courseId, status: "failed" })


    if (!foundTransaction || foundFailedTransaction) {
        throw new NotFoundException("تراکنش نامعتبر است");
    }


    if (
        dummyCardInfo.cardNumber !== cardInfo.cardNumber ||
        dummyCardInfo.cvv2 !== cardInfo.cvv2 ||
        dummyCardInfo.expireMonth !== cardInfo.expireMonth ||
        dummyCardInfo.expireYear !== cardInfo.expireYear
    ) {
        throw new UnauthorizedException("اطلاعات کارت شما نادرست است")
    }

    foundTransaction.status = "successful"

    course.enrolledStudents = [...course.enrolledStudents, userId]
    await course.save()
    await foundTransaction.save()

    return foundTransaction
}