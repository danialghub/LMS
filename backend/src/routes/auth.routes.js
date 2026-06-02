import express from 'express'
import { issueRefreshToken, login, logout, signup } from '../controller/auth.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js'
import { upload } from '../config/multer.js'

const router = express.Router()

router.get('/refresh', issueRefreshToken)


router.post("/signup", upload.single('image'), signup);

router.post("/login", login);
router.post("/logout", logout);






export default router