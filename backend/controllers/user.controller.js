import { User } from "../models/user.model.js"
import { sendResetPasswordEmail } from "../services/sendEmail.js"
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

