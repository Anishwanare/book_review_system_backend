import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { User } from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = catchAsyncError(async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill full form",
            });
        }

        const isRegistered = await User.findOne({ email });

        if (isRegistered) {
            return res.status(400).json({
                success: false,
                message: "User already registered",
            });
        }

        // hashing
        const hashPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashPassword,
        });

        res.status(200).json({
            success: true,
            message: "User registered successfully",
            user,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: true,
            message: "Something went wrong, try again later..",
        });
    }
});

export const login = catchAsyncError(async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill full form",
            });
        }

        const checkUser = await User.findOne({ email });

        if (!checkUser) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials.",
            });
        }

        const checkPass = await bcrypt.compare(password, checkUser.password);

        if (!checkPass) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials.",
            });
        }

        const token = jwt.sign({ id: checkUser._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRES,
        });


        const cookieName = checkUser?.role === "User" ? "User_Token" : "Admin_Token";
        res
            .status(200).cookie(cookieName,
                token,
                {
                    expires: new Date(Date.now() + process.env.COOKIES_EXPIRES * 24 * 60 * 60 * 1000),
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "None",
                }
            )
            .json({
                success: true,
                message: "User login successfully",
                user: checkUser
            });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong, try again later..", error,
            error
        });
    }
});


export const logout = catchAsyncError(async (req, res, next) => {
    try {
        res.status(200).cookie("User_Token", "", {
            expires: new Date(0)
        }).cookie("Admin_Token", "", {
            expires: new Date(0)
        }).json({
            success: true,
            message: "Logged out successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error?.message || "Internal server error",
            error
        })
    }
})


// update pass by id
export const updateProfileById = catchAsyncError(async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { name, email } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (name) user.name = name;
        if (email) user.email = email;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong, try again later.",
        });
    }
});


// fetch me 
export const fetchMe = catchAsyncError(async (req, res, next) => {

    try {
        const user = await User.findById(req.user?._id)
        if (!user) {
            return res.status(500).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: `${req.user?.name ? req.user.name.toUpperCase() : "User"} WELCOME`,
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong, try again later..", error,
            error
        });
    }
})