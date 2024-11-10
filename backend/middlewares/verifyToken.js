import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: "Access denied. No token provided!" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Giải mã token
        console.log('Decoded: ', decoded); // Log decoded để kiểm tra
        req.userId = decoded.userId; // Lưu trực tiếp userId vào request
        next();
    } catch (error) {
        console.log('JWT verification error: ', error.message); // Log lỗi nếu có
        return res.status(400).json({ message: "Invalid or expired token." });
    }
};
