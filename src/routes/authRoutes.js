import { Router } from "express";
import {
    showRegisterPage,
    registerUser,
    registerValidation
} from "../controllers/auth/register.js";
import {
    showLoginPage,
    loginUser,
    loginValidation,
    logoutUser
} from "../controllers/auth/login.js";

const authRoutes = Router();

authRoutes.get("/register", showRegisterPage);
authRoutes.post("/register", registerValidation, registerUser);
authRoutes.get("/login", showLoginPage);
authRoutes.post("/login", loginValidation, loginUser);
authRoutes.get("/logout", logoutUser);

export default authRoutes;
