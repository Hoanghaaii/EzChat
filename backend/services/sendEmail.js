import nodemailer from 'nodemailer'

export const sendResetPasswordEmail = async (email, resetToken) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        })
        const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Reset your password EzChat',
            html:
                `
                <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f7fc;
                            margin: 0;
                            padding: 0;
                        }
                        .email-container {
                            width: 100%;
                            max-width: 600px;
                            margin: 30px auto;
                            background-color: #ffffff;
                            padding: 30px;
                            border-radius: 8px;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                            text-align: center;
                        }
                        .email-header h1 {
                            color: #4A90E2;
                            font-size: 36px;
                            margin-bottom: 20px;
                        }
                        .email-body {
                            font-size: 16px;
                            color: #333333;
                            line-height: 1.5;
                            margin-bottom: 30px;
                        }
                        .btn {
                            display: inline-block;
                            background-color: #4A90E2;
                            color: #ffffff;
                            padding: 12px 24px;
                            text-decoration: none;
                            border-radius: 5px;
                            font-weight: bold;
                            margin-top: 20px;
                            font-size: 18px;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 30px;
                            font-size: 12px;
                            color: #777777;
                        }
                    </style>
                </head>
                <body>
                    <div class="email-container">
                        <div class="email-header">
                            <h1>Yêu cầu đổi mật khẩu mới</h1>
                        </div>
                        <div class="email-body">
                            <p>EzChat Xin chào!</p>
                            <p>Chúng tôi nhận được yêu cầu đổi mật khẩu đến từ bạn. Dưới đây là đường link đổi mật khẩu tài khoản của bạn, hãy click vào đường link để tiến hành đổi mật khẩu mới.</p>
                            <a href="${resetLink}" class="btn" style="color: #ffffff; text-decoration: none;">Đổi mật khẩu mới</a>
                            <p>Nếu bạn không yêu cầu đổi mật khẩu, vui lòng kiểm tra lại thông tin tài khoản và đổi lại mật khẩu để an toàn!</p>
                        </div>
                        <div class="footer">
                            <p>Chân thành cảm ơn!</p>
                            <p>Admin EzChat (Vũ Hoàng Hải)</p>
                            <p>&copy; 2024 EzChat. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
                `
        }
        await transporter.sendMail(mailOptions)
        console.log(`Password reset email sent to ${email}`)
    } catch (error) {
        console.log("Error sending reset password email: ", error)
        throw new Error("Failed to send email.")
    }
}

export const sendVerifyEmail = async (email, emailVerifyToken) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        })
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Verify Email EzChat",
            html: `
                <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f7fc;
                            margin: 0;
                            padding: 0;
                        }
                        .email-container {
                            width: 100%;
                            max-width: 600px;
                            margin: 30px auto;
                            background-color: #ffffff;
                            padding: 30px;
                            border-radius: 8px;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                            text-align: center;
                        }
                        .email-header h1 {
                            color: #4A90E2;
                            font-size: 36px;
                            margin-bottom: 20px;
                        }
                        .email-body {
                            font-size: 16px;
                            color: #333333;
                            line-height: 1.5;
                            margin-bottom: 30px;
                        }
                        .verify-token {
                            font-size: 24px;
                            font-weight: bold;
                            color: #4A90E2;
                            margin-top: 20px;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 30px;
                            font-size: 12px;
                            color: #777777;
                        }
                    </style>
                </head>
                <body>
                    <div class="email-container">
                        <div class="email-header">
                            <h1>Welcome to EzChat!</h1>
                        </div>
                        <div class="email-body">
                            <p>Hello,</p>
                            <p>Cảm ơn đã đăng ký trở thành thành viên EzChat! Mã Code để xác thực email của bạn ở bên dưới: </p>
                            <div class="verify-token">${emailVerifyToken}</div>
                            <p>Nếu không phải bạn thực hiện yêu cầu, xin hãy bỏ qua email này.</p>
                        </div>
                        <div class="footer">
                            <p>Chân thành cảm ơn!</p>
                            <p>Admin EzChat (Vũ Hoàng Hải)</p>
                            <p>&copy; 2024 EzChat. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        }
        await transporter.sendMail(mailOptions)
        console.log(`Verification email sent to ${email}`)
    } catch (error) {
        console.log("Error sending verification email: ", error)
        throw new Error("Failed to send email.")
    }
}
