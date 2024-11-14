import mongoose, { Schema } from 'mongoose'

const messageSchema = mongoose.Schema({
    sender: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    receiver: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    content: {type: String, required: true},
    messageType: {
        type: String,
        enum: ['text', 'image', 'file'],
        default: 'text'
    },
    status: {type: String, enum: [sent, delivered, read], default: 'sent'},
    conversationId: {type: Schema.Types.ObjectId, ref: 'Conversation', required: true},
}, {timestamps: true})

messageSchema.index({conversationId: 1, createdAt: -1})

export const Message = mongoose.model('Message', messageSchema)