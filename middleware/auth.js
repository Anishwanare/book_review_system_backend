import jwt from 'jsonwebtoken'
import { User } from '../model/userModel.js';
import { catchAsyncError } from './catchAsyncError.js';


export const isAuthenticated = catchAsyncError(async (req, res, next) => {
    const token = req.cookies.User_Token || req.cookies.Admin_Token;

    if (!token) {
        return res.status(400).json({
            success: false,
            message: "Please login.."
        })
    }
    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = await User.findById(decoded.id)
        next()
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Token Invalid or Expired"
        })
    }
})

export const isAuthorized = (...roles) => {
    return catchAsyncError((req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized. Please log in."
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Access denied. User is not authorized."
            });
        }

        next();
    });
};