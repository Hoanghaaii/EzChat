import express from 'express'
import userRouter from './user.router.js'
import messageRouter from './message.router.js'
import conversationRouter from './conversation.router.js'

const router = express.Router()

router.use("/users", userRouter)
router.use('/messages', messageRouter)
router.use('/conversation', conversationRouter)
export default router