import express from 'express'
import { confirmVerifyEmail, forgotPasword, resetPassword, signIn, signUp, verifyEmail } from '../controllers/user.controller.js'
import { verifyToken } from '../middlewares/verifyToken.js'

const router = express.Router()

router.post('/signup', signUp)
router.post('/signin', signIn)
router.post('/forgot-password',forgotPasword)
router.post('/reset-password/:token', resetPassword)
router.post('/verify-email',verifyToken, verifyEmail)
router.post('/confirm-verify-email', confirmVerifyEmail)

export default router;