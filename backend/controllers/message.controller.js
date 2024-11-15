import mongoose from "mongoose";
import { Message } from "../models/message.model.js";
import { Conversation } from "../models/conversation.model.js";
import { createOrGetConversation, getConversation } from "./conversation.controller.js";

export const sendMessage = async (req, res) => {
    try {
        const {sender, receiver, content} = req.body;
        if(!sender || !receiver || !content){
            return res.status(400).json({message: "Missing field!"})
        }
        const conversation = await createOrGetConversation(sender, receiver)
        console.log(conversation)
        const conversationId = conversation._id
        const message = new Message ({
            sender,
            receiver,
            content,
            conversationId
        })
        await message.save()
        await Conversation.findByIdAndUpdate(
            conversationId,
            {lastMessage: message._id, updateAt: Date.now()}, {new: true}
        )
        res.status(201).json({message: "Message sent successfully!", data: message})
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: "Server error", error: error.message})
    }
};

export const getMessages = async (req, res)=>{
    try {
        const {sender, receiver} = req.body
        const conv = await getConversation(sender, receiver)
        if(!conv){
            return res.status(400).json({message: "No conversation found!"})
        }
        const messages = await Message.find({conversationId: conv._id})
        console.log(messages)
        if(!messages){
            return res.status(400).json("No messages")
        }
        res.status(200).json({message: "Get messages successflly!", messages})
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message})
    }
}

export const updateStatusToDelivered = async (req, res)=>{
    try {
        const {conversationId, receiver} = req.body
        await markMessageAsDelivered(conversationId, receiver);
        res.status(200).json({message: "Update status to delivered successfully!"})
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message})
    }
}

export const updateStatusToRead = async (req, res)=>{
    try {
        const {conversationId, receiver} = req.body
        await markMessageAsRead(conversationId, receiver);
        res.status(200).json({message: "Update status to read successfully!"})
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message})
    }
}



export const markMessageAsDelivered = async (conversationId, receiverId)=>{
    await Message.updateMany(
        {conversationId, receiver: receiverId, status: 'sent'},
        {status: 'delivered'}
    )
}

export const markMessageAsRead = async (conversationId, receiverId) =>{
    await Message.updateMany(
        {conversationId, receiver: receiverId, status: 'delivered'},
        {status: 'read'}
    )
}


