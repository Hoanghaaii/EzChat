import express from 'express'
import { acceptFriendRequest, checkAuth, confirmVerifyEmail, forgotPasword, getFriends, getPendingRequest, rejectFriendRequest, resetPassword, sendFriendRequest, signIn, signUp, updateAccount, verifyEmail } from '../controllers/user.controller.js'
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
router.get('/get-friends', verifyToken, getFriends)
router.put('/update-account',verifyToken, uploadAvatarMiddleWare, updateAccount)
router.post('/send-friend-request',verifyToken, sendFriendRequest)
router.post('/accept-friend-request',verifyToken, acceptFriendRequest)
router.post('/reject-friend-request',verifyToken, rejectFriendRequest)
router.get('/get-pending-request', verifyToken, getPendingRequest)

export default router;