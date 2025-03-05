import mongoose from "mongoose";

const book = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    bookImg: {
        publicId: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }

}, { timestamps: true })

export const Book = mongoose.model("Book", book)