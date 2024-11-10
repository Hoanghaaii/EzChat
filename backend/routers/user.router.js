import express from 'express'
import { checkAuth, confirmVerifyEmail, forgotPasword, resetPassword, signIn, signUp, updateAccount, verifyEmail } from '../controllers/user.controller.js'
import { verifyToken } from '../middlewares/verifyToken.js'
import { uploadAvatarMiddleWare } from '../aws/aws.js'

const router = express.Router()

router.post('/signup', signUp)
router.post('/signin', signIn)
router.post('/forgot-password',forgotPasword)
router.post('/reset-password/:token', resetPassword)
router.post('/verify-email',verifyToken, verifyEmail)
router.post('/confirm-verify-email', confirmVerifyEmail)
router.get('/check-auth', verifyToken, checkAuth)

router.put('/update-account',verifyToken, uploadAvatarMiddleWare, updateAccount)

export default router;