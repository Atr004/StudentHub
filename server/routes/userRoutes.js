import express from "express";
import asyncHandler from "express-async-handler";
import{loginLimiter, registerLimiter} from "../middleware/rateLimiter.js";
import { registerUser, loginUser, getProfile,  getAllUsers} from "../controllers/userController.js";

const router = express.Router();


router.post("/register", registerLimiter, registerUser);
router.post("/login", loginLimiter, loginUser);
router.get("/profile/:id", getProfile);
router.get("/", getAllUsers);

export default router;
