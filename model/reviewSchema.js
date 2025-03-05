import mongoose from "mongoose";

const review = new mongoose.Schema({
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: true
    },
    desc: {
        type: String
    },
    rate: {
        type: Number
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})

export const Review = mongoose.model("Review", review)