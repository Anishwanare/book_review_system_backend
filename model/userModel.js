import mongoose from "mongoose";

const user = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Admin', "User"],
        default: "User"
    }
})

export const User = mongoose.model("User", user)