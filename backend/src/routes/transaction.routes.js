import express from 'express'
import { requestZarinPal, verifyZarinPal } from '../controller/transaction.controller.js'
import { protectRoute, allowStudent } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.get('/verify', verifyZarinPal)


router.use(protectRoute, allowStudent)

router.post('/request', requestZarinPal)




export default router