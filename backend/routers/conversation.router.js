import express from 'express'
import { createOrGetConversation } from '../controllers/conversation.controller.js'

const router = express.Router()
router.post('/get-conversation', createOrGetConversation)

export default router;