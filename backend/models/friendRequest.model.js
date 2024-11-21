import mongoose from "mongoose";

const FriendRequestSchema = mongoose.Schema({
    sender: {type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true},
    receiver: {type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true},
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    }
}, {timestamps: true})
export const FriendRequest = mongoose.model('FriendRequest', FriendRequestSchema)
