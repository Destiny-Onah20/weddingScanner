import {Router} from "express";
import { login, signUp, verifyEmail, createAnEvent,generateWeddingLink, shareEventLink, getOneEvent, allEvent } from "../controllers/user.js";
import { authenticate } from "../middleware/authenticate.js";
import { uploadFile } from "../controllers/collections.js";

const router= Router();
router.post("/signup",signUp)
router.post("/verify",verifyEmail)
router.post("/login",login);
router.post("/events", authenticate ,createAnEvent);
router.post("/events/:id/links/", generateWeddingLink);
router.post("/events/:id/share", shareEventLink);
router.get("/events/:id", getOneEvent);
router.post("/events/:id/uploads", uploadFile)
router.get("/events/:id",authenticate, allEvent);

export default router
