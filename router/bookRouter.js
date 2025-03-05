import express from "express";
import { deleteBook, fetchAllBooks, fetchBookById, fetchMyBooks, registerBook, updateBook } from "../controller/bookController.js";
import { isAuthenticated, isAuthorized } from "../middleware/auth.js";
import { getAverageBookReview, reviewBook } from "../controller/reviewController.js";

const router = express.Router()

router.post('/publish', isAuthenticated, isAuthorized('Admin'), registerBook)

router.get('/fetch-publisher-book', isAuthenticated, isAuthorized('Admin'), fetchMyBooks)

router.get('/fetch-all-book', fetchAllBooks)

router.delete('/delete', isAuthenticated, isAuthorized("Admin"), deleteBook)

router.put('/update/:bookId', isAuthenticated, isAuthorized("Admin"), updateBook)

router.get('/fetch-single-book/:bookId', fetchBookById)


// review
router.get('/average-book-review/:bookId', getAverageBookReview)

router.post('/give-review/:bookId', isAuthenticated, isAuthorized("User"), reviewBook)



export default router;