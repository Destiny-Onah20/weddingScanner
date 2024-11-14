import {Router} from "express";
import { login, signUp, verifyEmail, createAnEvent,generateWeddingLink, shareEventLink, getOneEvent, AllUser, getAllEvent, oneUser } from "../controllers/user.js";
import { authenticate } from "../middleware/authenticate.js";
import { uploadFile } from "../controllers/collections.js";
import { signupValidation } from "../middleware/validation.js";

const router= Router();
router.post("/signup",signupValidation,signUp)
router.post("/verify",verifyEmail)
router.post("/login",login);
router.post("/events", authenticate ,createAnEvent);
router.post("/events/:id/links/", generateWeddingLink);
router.post("/events/:id/share", shareEventLink);
router.get("/events/:id", getOneEvent);
router.post("/events/:id/uploads", uploadFile);
router.get("/events/users/:user", authenticate, getAllEvent);
router.get("/users",AllUser);
router.get("/user",authenticate,oneUser);

export default router
