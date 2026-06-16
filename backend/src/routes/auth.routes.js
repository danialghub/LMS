import express from 'express'
import { changePassword, issueRefreshToken, login, logout, signup, updateInstructorProfile, updateProfile } from '../controller/auth.controller.js';
import { allowInstructor, protectRoute } from '../middlewares/auth.middleware.js'
import { upload } from '../config/multer.js'

const router = express.Router()

router.get('/refresh', issueRefreshToken)
router.get('/check', protectRoute, (req, res) => res.sendStatus(200))


router.post("/signup", upload.single('image'), signup);

router.post("/login", login);
router.post("/logout", logout);

router.use(protectRoute)
router.patch('/change-password', changePassword)
router.patch('/change-profile', upload.single('image'), updateProfile)
router.patch('/change-instructor-specifications', allowInstructor, updateInstructorProfile)






export default router