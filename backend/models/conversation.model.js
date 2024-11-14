import mongoose, { Schema }  from "mongoose";

const conversationSchema = mongoose.Schema({
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }],
    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: 'Message'
    },
}, { timestamps: true})

conversationSchema.index({participants: 1}, {unique: true})
export const Conversation = mongoose.model('Conversation', conversationSchema)