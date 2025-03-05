import mongoose from "mongoose";
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { Book } from "../model/bookSchema.js";
import { Review } from "../model/reviewSchema.js";
import { User } from "../model/userModel.js";

export const reviewBook = catchAsyncError(async (req, res, next) => {
    try {
        const { bookId } = req.params;
        const { desc, rate } = req.body;

        if (!bookId) {
            return res.status(400).json({
                success: false,
                message: "Book ID is required",
            });
        }

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found",
            });
        }

        const user = await User.findById(req.user?._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (user.role !== "User") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to post review",
            });
        }

        // Check if user already reviewed 
        const givenReview = await Review.findOne({ bookId, userId: req.user?._id });

        if (givenReview) {
            return res.status(400).json({
                success: false,
                message: "You already given a review..",
            });
        }

        const review = await Review.create({
            bookId,
            userId: user._id,
            desc,
            rate
        });

        res.status(201).json({
            success: true,
            message: "Review added successfully",
            review,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get reviews",
            error: error.message
        })
    }
});


// out of 5 i will get the average who gives review, first we have to cound the no. of users for perticular book
export const getAverageBookReview = catchAsyncError(async (req, res, next) => {
    try {
        const { bookId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Book ID",
            });
        }

        // Fetch reviews with user details IMP
        const reviews = await Review.aggregate([
            { $match: { bookId: new mongoose.Types.ObjectId(bookId) } },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user",
                },
            },
            { $unwind: "$user" },
            { $project: { "user.password": 0 } },
        ]);

        // review averagee
        const avgRatingResult = await Review.aggregate([
            { $match: { bookId: new mongoose.Types.ObjectId(bookId) } },
            { $group: { _id: "$bookId", averageRating: { $avg: "$rate" } } },
        ]);

        const averageRating = avgRatingResult.length > 0 ? avgRatingResult[0].averageRating.toFixed(2) : 0;

        return res.status(200).json({
            success: true,
            message: reviews.length > 0 ? "Reviews fetched successfully" : "No reviews found",
            averageRating: parseFloat(averageRating),
            totalReviews: reviews.length,
            reviews,
        });
    } catch (error) {
        console.error("Error fetching book reviews:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to get reviews",
            error: error.message,
        });
    }
});


