import { User } from "../models/user.model.js"
import { sendResetPasswordEmail, sendVerifyEmail } from "../services/sendEmail.js"
import { generateCode } from "../utils/generateCode.js"
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js"
import bcrypt from 'bcryptjs'
import crypto from 'crypto'



export const signUp = async (req, res)=>{
    const {email, password, username} = req.body
    try {
        const userExsists = await User.findOne({$or: [{email}, {username}]})
        if(userExsists){
            return res.status(400).json({success: false, message: "User Exsist!"})
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })
        await newUser.save()
        res.status(201).json({message: "Create user successfully"})
    } catch (error) {
        res.status(500).json({message: "Server error: ", error: error.message})
    }
}

export const signIn= async (req, res)=>{
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message: "No user found!"})
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({message: "Invalid password!"})
        }
        const token = generateTokenAndSetCookie(res, user._id)
        res.status(200).json({message: "Login successfully!", token})
    } catch (error) {
        res.status(500).json({message: "Server error: ", error: error.message})
    }
}

export const forgotPasword = async (req, res)=>{
    const {email} = req.body
    try {
        const user = await User.findOne({email})
    if(!user){
        return res.status(404).json({message: "User not found!"})
    }
    const resetPasswordToken = crypto.randomBytes(32).toString('hex')
    const resetPasswordTokenExprises = Date.now() + 3600000;
    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpires = resetPasswordTokenExprises;
    await user.save()
    await sendResetPasswordEmail(user.email, resetPasswordToken)
    res.status(200).json({message: 'Reset password link has been sent to your email.'})
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Server error.'})
    }
}

export const resetPassword = async (req, res)=>{
    const {token} = req.params
    const {password} = req.body
    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: {$gt: Date.now()}
        })
        if(!user){
            return res.status(400).json({message: "Invalid or expired reset token!"})
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined
        user.resetPasswordExpires = undefined
        await user.save()
        console.log("thanh cong")
        res.status(200).json({message: "Reset password successfully!"})
    } catch (error) {
        res.status(500).json({message: "Server error", error})
        console.log(error)
    }
}

export const verifyEmail = async (req, res)=>{
    try {
        const { userId } = req;
        console.log(`Hello ${userId}`)
        // Tìm người dùng với userId đã cung cấp
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(400).json({ message: "No user found!" });
        }

        // Tạo mã xác minh và lưu vào trường emailVerificationToken
        const code = generateCode()
        user.emailVerificationToken = code;
        user.emailVerificationTokenExpires = Date.now() + 3600000;
        await user.save();

        // Gửi email xác minh
        await sendVerifyEmail(user.email, code);

        res.status(200).json({ message: "Verification email sent successfully!" });
    } catch (error) {
        console.error("Error verifying email: ", error);
        res.status(500).json({ message: "Failed to send verification email." });
    }
}

export const confirmVerifyEmail = async (req, res)=>{
    try {
        const {code} = req.body
        const user = await User.findOne({emailVerificationToken: code, emailVerificationTokenExpires: {$gt: Date.now()}})
        if(!user){
            return res.status(400).json({message: "Cant find user or Code expired!"})
        }
        user.isEmailVerified = true
        user.emailVerificationToken = undefined
        user.emailVerificationTokenExpires = undefined
        await user.save()
        res.status(200).json("Verify Email successfully!")
    } catch (error) {
        res.status(500).json({message: "Server error: ", error: error.message})
    }
}
export const checkAuth = async (req, res)=>{

}
