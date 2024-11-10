import express from 'express'
import { forgotPasword, resetPassword, signIn, signUp } from '../controllers/user.controller.js'
import { verifyToken } from '../middlewares/verifyToken.js'

const router = express.Router()

router.post('/signup', signUp)
router.post('/signin', signIn)
router.post('/forgot-password',forgotPasword)
router.post('/reset-password/:token', resetPassword)

export default router;