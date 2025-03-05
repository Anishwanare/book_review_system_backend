import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { Book } from "../model/bookSchema.js";
import cloudinary from 'cloudinary';
import { User } from "../model/userModel.js";

export const registerBook = catchAsyncError(async (req, res, next) => {
    try {
        if (!req.files) {
            return res.status(400).json({
                success: false,
                message: "File is required",
            });
        }

        const { bookImg } = req.files;
        const allowedFiles = ["image/jpg", "image/jpeg", "image/png"];

        if (!allowedFiles.includes(bookImg.mimetype)) {
            return res.status(400).json({
                success: false,
                message: `${bookImg.mimetype} not supported`,
            });
        }

        const { name, desc } = req.body;

        if (!name || !desc) {
            return res.status(400).json({
                success: false,
                message: "All details are required",
            });
        }

        let cloudinaryResponse;
        try {
            cloudinaryResponse = await cloudinary.uploader.upload(bookImg.tempFilePath, {
                folder: "BOOK_REVIEW_SYSTEM",
            });

            if (!cloudinaryResponse || cloudinaryResponse.error) {
                return res.status(400).json({
                    success: false,
                    message: "Error while uploading image, try again later",
                });
            }
            console.log(cloudinaryResponse);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to upload image" + error,
            });
        }

        const bookData = {
            name,
            desc,
            bookImg: {
                publicId: cloudinaryResponse.public_id,
                url: cloudinaryResponse.secure_url,
            },
            createdBy: req.user?._id,
        };

        await Book.create(bookData);

        res.status(201).json({
            success: true,
            message: "Book created successfully",
            books: bookData,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to Upload book",
            error: error.message,
        });
    }
});

// fetch books created by admin

export const fetchMyBooks = catchAsyncError(async (req, res, next) => {
    try {
        const admin = await User.findById(req.user?._id);

        if (!admin || admin.role !== "Admin") {
            return res.status(404).json({
                success: false,
                message: "Admin not found",
            });
        }

        const myBooks = await Book.find({ createdBy: req.user?._id })

        res.status(200).json({
            success: true,
            message: "Successfully fetched all books",
            size: myBooks.length,
            books: myBooks
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch books",
            error: error.message,
        });
    }
})


export const fetchAllBooks = catchAsyncError(async (req, res, next) => {
    try {
        const books = await Book.find();

        res.status(200).json({
            success: true,
            message: "Successfully fetched all books",
            size: books.length,
            books,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch books",
            error: error.message,
        });
    }
});


export const updateBook = catchAsyncError(async (req, res, next) => {
    try {
        const { bookId } = req.params;
        const { name, desc } = req.body;

        if (!bookId) {
            return res.status(400).json({
                success: false,
                message: "BookId is required",
            });
        }

        const book = await Book.findById(bookId)

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Failed to fetch books"
            });
        }

        if (name) {
            book.name = name
        }
        if (desc) {
            book.desc = desc
        }

        await book.save()

        res.status(200).json({
            success: true,
            message: "Book updated succesfully",
            books: book
        })
    } catch (error) {
        res.status(200).json({
            success: true,
            message: "Failed to fetched book details",
            error: error.message
        })
    }
})

export const deleteBookById = catchAsyncError(async (req, res, next) => {
    try {
        const { bookId } = req.params;

        if (!bookId) {
            return res.status(400).json({
                success: false,
                message: "BookId is required",
            });
        }

        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found",
            });
        }

        await book.deleteOne();

        res.status(200).json({
            success: true,
            message: "Book deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete book",
            error: error.message,
        });
    }
});


export const fetchBookById = catchAsyncError(async (req, res, next) => {
    try {
        const { bookId } = req.params;
        if (!bookId) {
            return res.status(400).json({
                success: false,
                message: "Book Id is required"
            })
        }

        const book = await Book.findById(bookId)

        if (!book) {
            return res.status(400).json({
                success: false,
                message: "Book not found.."
            })
        }

        res.status(200).json({
            success: true,
            message: "Successfully fetched book details",
            book
        })
    } catch (error) {
        res.status(200).json({
            success: true,
            message: "Failed to fetched book details",
            error: error.message
        })
    }
})