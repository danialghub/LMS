import express from 'express'
import { createTransaction, updateTransactionStatus } from '../controller/transaction.controller.js'
import { protectRoute, allowStudent } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.use(protectRoute, allowStudent)

router.post('/place', createTransaction)
router.put('/make', updateTransactionStatus)



export default router