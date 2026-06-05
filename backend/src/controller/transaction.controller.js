import { courseSchema, chapterSchema, lectureSchema } from "../validators/course.validator.js";
import { HTTPSTATUS } from "../config/http.config.js";
import {
    requestZarinPalService,
    verifyZarinPalService
} from "../services/transaction.service.js";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";



export const requestZarinPal = asyncHandler(
    async (req, res) => {

        const userId = req.user._id
        const { courseId } = req.body;

        if (!courseId)
            return res.sendStatus(HTTPSTATUS.BAD_REQUEST)

        const { status, authority = null, transactionId = null, paymentUrl = null, message = null } = await requestZarinPalService(userId, courseId)
        if (status === "OK") {

            return res.status(HTTPSTATUS.CREATED).json({ authority, transactionId, paymentUrl })
        }
        res.status(HTTPSTATUS.BAD_REQUEST).json({ message })

    }
)
export const verifyZarinPal = asyncHandler(
    async (req, res) => {

        const { Authority, Status } = req.query;


        if (!Authority)
            return res.sendStatus(HTTPSTATUS.BAD_REQUEST)

        const { status, refId = null, amount = 0, code = 400, cardNumber = null, courseId = null } = await verifyZarinPalService(Authority, Status)
        console.log(code);

        if (status === "OK") {
            return res.redirect(
                `http://localhost:5173/transaction-result?status=success&ref_id=${refId}&amount=${amount}&card_number=${cardNumber}&cId=${courseId}`
            );
        } else if (status === "already_verified") {
            return res.redirect('http://localhost:5173/transaction-result?status=already_verified');
        } else if (status === "failed") {
            return res.redirect(`http://localhost:5173/transaction-result?status=failed&code=${code}`);
        }


    }
)