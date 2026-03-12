import { body, validationResult } from "express-validator";
import { scryptSync, timingSafeEqual } from "crypto";
import { findUserByUsername } from "../../models/user/user.js";

const showLoginPage = (req, res) => {
    res.render("auth/login", {
        title: "Login",
        errors: [],
        form: {},
        successMessage: ""
    });
};

const loginValidation = [
    body("username")
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage("Username is required"),
    body("password")
        .isLength({ min: 1 })
        .withMessage("Password is required")
];

const verifyPassword = (password, salt, storedHash) => {
    const hashedInput = scryptSync(password, salt, 64).toString("hex");
    const inputBuffer = Buffer.from(hashedInput, "hex");
    const storedBuffer = Buffer.from(storedHash, "hex");

    if (inputBuffer.length !== storedBuffer.length) {
        return false;
    }

    return timingSafeEqual(inputBuffer, storedBuffer);
};

const loginUser = async (req, res) => {
    const errors = validationResult(req);
    const form = {
        username: req.body.username ?? ""
    };

    if (!errors.isEmpty()) {
        return res.status(400).render("auth/login", {
            title: "Login",
            errors: errors.array(),
            form,
            successMessage: ""
        });
    }

    try {
        const username = req.body.username.trim();
        const password = req.body.password;
        const user = await findUserByUsername(username);

        if (!user || !verifyPassword(password, user.passwordSalt, user.passwordHash)) {
            return res.status(401).render("auth/login", {
                title: "Login",
                errors: [{ msg: "Invalid username or password" }],
                form,
                successMessage: ""
            });
        }

        if (req.session) {
            req.session.user = {
                id: user.id,
                username: user.username
            };
        }

        return res.render("auth/login", {
            title: "Login",
            errors: [],
            form: {},
            successMessage: "You are now logged in."
        });
    } catch (error) {
        console.error("Error logging in:", error);
        return res.status(500).render("auth/login", {
            title: "Login",
            errors: [{ msg: "Unable to login right now. Please try again later." }],
            form,
            successMessage: ""
        });
    }
};

export { showLoginPage, loginUser, loginValidation };