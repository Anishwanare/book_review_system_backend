import express from "express";
import { fetchMe, login, logout, register } from "../controller/userController.js";
import { isAuthenticated, isAuthorized } from "../middleware/auth.js";

const router = express.Router()


router.post('/register', register)
router.post('/login', login)
router.get('/fetch-me', isAuthenticated, isAuthorized('User', 'Admin'), fetchMe)
router.get('/logout', isAuthenticated, isAuthorized('User', 'Admin'), logout)

export default router