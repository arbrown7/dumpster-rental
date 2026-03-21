import { body, validationResult } from "express-validator";
import { randomBytes, scryptSync } from "crypto";
import { createUser, findUserByUsername } from "../../models/user/user.js";

const showRegisterPage = (req, res) => {
    res.render("auth/register", {
        title: "Register",
        errors: [],
        form: {},
        successMessage: ""
    });
};

const hashPassword = (password) => {
    const salt = randomBytes(16).toString("hex");
    const hash = scryptSync(password, salt, 64).toString("hex");

    return {
        salt,
        hash
    };
};

const registerValidation = [
    body("username")
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage("Username must be between 3 and 30 characters")
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage("Username can only include letters, numbers, and underscores"),
    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long")
];

const registerUser = async (req, res) => {
    const errors = validationResult(req);
    const form = {
        username: req.body.username ?? ""
    };

    if (!errors.isEmpty()) {
        return res.status(400).render("auth/register", {
            title: "Register",
            errors: errors.array(),
            form,
            successMessage: ""
        });
    }

    try {
        const username = req.body.username.trim();
        const existingUser = await findUserByUsername(username);

        if (existingUser) {
            return res.status(409).render("auth/register", {
                title: "Register",
                errors: [{ msg: "That username is already taken" }],
                form,
                successMessage: ""
            });
        }

        const { hash, salt } = hashPassword(req.body.password);
        const createdUser = await createUser({
            username,
            passwordHash: hash,
            passwordSalt: salt
        });

        if (!req.session) {
            return res.redirect("/");
        }

        req.session.user = {
            id: createdUser.id,
            username: createdUser.username
        };

        req.session.save((saveError) => {
            if (saveError) {
                console.error("Error saving session after registration:", saveError);
                return res.redirect("/");
            }

            return res.redirect("/");
        });
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).render("auth/register", {
            title: "Register",
            errors: [{ msg: "Unable to register right now. Please try again later." }],
            form,
            successMessage: ""
        });
    }
};

export { showRegisterPage, registerUser, registerValidation };