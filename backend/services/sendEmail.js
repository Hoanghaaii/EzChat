import nodemailer from 'nodemailer'

export const sendResetPasswordEmail = async (email, resetToken)=>{
    try {
        const transporter = nodemailer.createTransport({
            service:'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        })
        const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Reset your password',
            html: 
                `
                <p>You requested a password reset. Please click the link below to reset your password:</p>
                <a href="${resetLink}">Reset Password</a>
                <p>If you didn't request a password reset, please ignore this email.</p>
                `
        }
        await transporter.sendMail(mailOptions)
        console.log(`Password reset sent to ${email}`)
    } catch (error) {
        console.log("Error sending reset password email: ", error)
        throw new Error("Failed to send email.")
    }
}