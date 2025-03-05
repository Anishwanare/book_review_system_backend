import express from "express";
import { fetchMe, login, logout, register, updateProfileById } from "../controller/userController.js";
import { isAuthenticated, isAuthorized } from "../middleware/auth.js";

const router = express.Router()


router.post('/register', register)
router.post('/login', login)
router.get('/fetch-me', isAuthenticated, isAuthorized('User', 'Admin'), fetchMe)
router.get('/logout', isAuthenticated, isAuthorized('User', 'Admin'), logout)
router.put('/update/:userId', isAuthenticated, isAuthorized('User', 'Admin'), updateProfileById)

export default router