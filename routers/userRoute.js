import {Router} from "express";
import { login, signUp, verifyEmail, createAnEvent } from "../controllers/user.js";
import { authenticate } from "../middleware/authenticate.js";

const router= Router();
router.post("/signup",signUp)
router.post("/verify",verifyEmail)
router.post("/login",login);
router.post("/events", authenticate ,createAnEvent)

export default router
