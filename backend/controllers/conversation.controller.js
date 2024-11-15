import { Conversation } from "../models/conversation.model.js";

export const createOrGetConversation = async (sender, receiver) => {
    // Find or create conversation between sender and receiver
    let conversation = await Conversation.findOne({
        participants: { $all: [sender, receiver] },
    });

    if (!conversation) {
        // If no conversation exists, create a new one
        conversation = new Conversation({
            participants: [sender, receiver],
            updatedAt: Date.now(),
        });
        await conversation.save();
    }
    return conversation;  // Return conversation data instead of sending a response
};

export const getConversation = async (sender, receiver)=>{
    let conv = await Conversation.findOne({
        participants: { $all: [sender, receiver] },
    })
    if(!conv){
        return false
    }
    return conv
}