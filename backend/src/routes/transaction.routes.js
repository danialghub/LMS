import express from 'express'
import { createTransaction } from '../controller/transaction.controller.js'
import {  protectRoute, allowStudent } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.use(protectRoute, allowStudent)

router.post('/purchase/:courseId', createTransaction)



export default router