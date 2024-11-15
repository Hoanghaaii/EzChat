import express from 'express'
import {  getMessages, sendMessage, updateStatusToDelivered, updateStatusToRead } from '../controllers/message.controller.js'

const router = express.Router()

router.post('/send-message', sendMessage)
router.post('/get-messages', getMessages)
router.post('/update-status-delivered', updateStatusToDelivered)
router.post('/update-status-read', updateStatusToRead)

export default router