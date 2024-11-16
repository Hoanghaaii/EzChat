import { postFile } from "../aws/aws.js"
import { FriendRequest } from "../models/friendRequest.model.js"
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
    try {
        const {userId} = req
        console.log(userId)
        const user =await User.findOne({_id: userId})
        if(!user){
            return res.status(400).json({message: "No user auth!"})
        }
        res.status(200).json({message: "Check Authencation completely", user})
    } catch (error) {
        res.status(400).json({message: "Server error: ", error: error.message})
    }
}

export const updateAccount = async (req, res)=>{
    try {
        const {userId} = req
        const {address} = req.body
        const user = await User.findOne({_id: userId})
        if(!user){
            return res.status(400).json({ message: "No valid token found!" });
        }
        if(req.file){
            const uploadResult = await postFile(req, 'avatars');
            if(!uploadResult.success){
                console.log(uploadResult.error)
                return res.status(500).json({message: "Failed to upload avatar!"})
            }
            user.avatar = uploadResult.fileUrl
        }
        if(address){
            user.address = address
        }
        await user.save()
        return res.status(200).json({message: "Account updated successfully!"})
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Server error: ", error: error.message})
    }
}

export const getFriends = async (req, res)=>{
    try {
        const {userId} = req
        if(!userId){
            return res.status(400).json({ message: "Userid not found!" });
        }
        const user = await User.findById(userId)
        if(!user){
            return res.status(400).json({ message: "User not found!" });
        }
        console.log(user.friends)
        res.status(200).json({message: "Get friends successfully!",friend: user.friends})
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const sendFriendRequest = async (req, res)=>{
    try {
        const {userId} = req
        const {receiver} = req.body
        if(!userId || !receiver){
            return res.status(400).json({message: "Required both sender and receiver!"})
        }
        if(userId === receiver){
            return res.status(400).json({message: "You can not send friend request to your self!"})
        }
        const user = await User.findById(userId)
        const existingRequest = await FriendRequest.findOne({sender: userId, receiver: receiver})
        if(existingRequest){
            return res.status(400).json({message: "Friend request already sent!"})
        }
        const isAlreadyFriend = user.friends.includes(receiver)
        if(isAlreadyFriend){
            return res.status(400).json({message: "Already are friends!"})
        }
        const friendRequest = new FriendRequest({
            sender: userId,
            receiver: receiver,
        })
        await friendRequest.save()
        res.status(200).json({message: "Friend request sent successfully!", id: friendRequest._id})
    } catch (error) {
        res.status(500).json({message: "Friend request sent failed!", error: error.message})
    }
}

export const acceptFriendRequest = async (req, res) => {
    try {
      const { userId } = req;
      const { requestId } = req.body;
      // Validate inputs
      if (!userId || !requestId) {
        return res.status(400).json({ message: "Missing required fields!" });
      }
  
      // Find the friend request
      const request = await FriendRequest.findById(requestId);
      if (!request) {
        return res.status(404).json({ message: "Friend request not found!" });
      }
  
      // Check if the request is still pending
      if (request.status !== "pending") {
        return res.status(400).json({ message: "Friend request is not pending." });
      }
  
      // Ensure the recipient of the request is the current user
      if (request.receiver.toString() !== userId) {
        return res.status(403).json({ message: "You are not authorized to accept this request." });
      }
  
      // Update the friend request status to "accepted"
      request.status = "accepted";
      await request.save();
  
      // Add each user to the other's friends list
      const sender = await User.findById(request.sender);
      const receiver = await User.findById(request.receiver);
  
      if (!sender || !receiver) {
        return res.status(404).json({ message: "Sender or receiver not found!" });
      }
  
      // Update friends list
      sender.friends.push(receiver._id);
      receiver.friends.push(sender._id);
  
      await sender.save();
      await receiver.save();
  
      res.status(200).json({ message: "Friend request accepted successfully!" });
    } catch (error) {
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  };

  export const rejectFriendRequest = async (req, res) => {
    try {
      const { userId } = req;
      const { requestId } = req.body;
      // Validate inputs
      if (!userId || !requestId) {
        return res.status(400).json({ message: "Missing required fields!" });
      }
  
      // Find the friend request
      const request = await FriendRequest.findById(requestId);
      if (!request) {
        return res.status(404).json({ message: "Friend request not found!" });
      }
  
      // Check if the request is still pending
      if (request.status !== "pending") {
        return res.status(400).json({ message: "Friend request is not pending." });
      }
  
      // Ensure the recipient of the request is the current user
      if (request.receiver.toString() !== userId) {
        return res.status(403).json({ message: "You are not authorized to accept this request." });
      }
  
      // Update the friend request status to "accepted"
      request.status = "rejected";
      await request.save();
      res.status(200).json({ message: "Friend request rejected successfully!" });
    } catch (error) {
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
export const getPendingRequest = async (req, res)=>{
    try {
        const {userId} = req
        if (!userId) {
            return res.status(400).json({ message: "Missing userid!" });
        }
        const pendingRequest = await FriendRequest.find({receiver: userId, status: 'pending'})
        if(!pendingRequest){
            return res.status(403).json({ message: "No pending request found!" });
        }
        res.status(200).json({ message: "Get pending request successfully!", request: pendingRequest });
    } catch (error) {
      return res.status(500).json({ message: "Server error", error: error.message });
    }
}