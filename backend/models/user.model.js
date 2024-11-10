import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    username: {type: String, require: true, unique: true},
    email: {type: String, require: true, unique: true},
    password: {type: String, require: true},
    avatar: {type: String},
    friends: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    isEmailVerified: {type: Boolean, default: false},
    resetPasswordToken: {type: String},
    resetPasswordExpires: {type: Date},
    emailVerificationToken: {type: String},
    emailVerificationTokenExpires: {type: Date},
}, {timestamps: true}
)

export const User = mongoose.model("User", UserSchema)