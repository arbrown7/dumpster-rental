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
import {
    showProfilePage,
    handleProfileUpdate,
    profileValidation
} from "../controllers/auth/profile.js";
import { requireLogin } from "../middleware/auth.js";

const authRoutes = Router();

authRoutes.get("/register", showRegisterPage);
authRoutes.post("/register", registerValidation, registerUser);
authRoutes.get("/login", showLoginPage);
authRoutes.post("/login", loginValidation, loginUser);
authRoutes.get("/logout", logoutUser);
authRoutes.get("/profile", requireLogin, showProfilePage);
authRoutes.post("/profile", requireLogin, profileValidation, handleProfileUpdate);

export default authRoutes;
