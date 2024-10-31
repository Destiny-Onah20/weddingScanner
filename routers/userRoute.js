import express from "express";
import { login, signUp, verifyEmail } from "../controllers/user.js";
const router=express.Router();
router.post("/signUp",signUp)
router.post("/verify",verifyEmail)
router.post("/login",login)

export default router
