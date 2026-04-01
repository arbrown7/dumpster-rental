import { body, validationResult } from "express-validator";
import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { findUserById, findUserByUsername, updateUser } from "../../models/user/user.js";

const showProfilePage = async (req, res) => {
    const userId = req.session.user?.id;

    try {
        const user = await findUserById(userId);

        if (!user) {
            req.flash('error', 'User not found.');
            return res.redirect('/');
        }

        return res.render('auth/profile', {
            title: 'My Profile',
            user,
            errors: [],
            successMessage: req.flash('success')[0] || ''
        });
    } catch (error) {
        console.error('Error loading profile:', error);
        req.flash('error', 'Unable to load profile. Please try again later.');
        return res.redirect('/');
    }
};

const profileValidation = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only include letters, numbers, and underscores'),
    body('newPassword')
        .optional({ checkFalsy: true })
        .isLength({ min: 8 })
        .withMessage('New password must be at least 8 characters long'),
    body('currentPassword')
        .custom((value, { req }) => {
            if (req.body.newPassword && !value) {
                throw new Error('Current password is required to set a new password');
            }
            return true;
        })
];

const verifyPassword = (password, salt, storedHash) => {
    const hashedInput = scryptSync(password, salt, 64).toString("hex");
    const inputBuffer = Buffer.from(hashedInput, "hex");
    const storedBuffer = Buffer.from(storedHash, "hex");
    if (inputBuffer.length !== storedBuffer.length) return false;
    return timingSafeEqual(inputBuffer, storedBuffer);
};

const handleProfileUpdate = async (req, res) => {
    const userId = req.session.user?.id;
    const errors = validationResult(req);

    const renderWithErrors = async (errs) => {
        try {
            const user = await findUserById(userId);
            return res.status(400).render('auth/profile', {
                title: 'My Profile',
                user: { ...user, username: req.body.username, email: req.body.email },
                errors: errs,
                successMessage: ''
            });
        } catch {
            req.flash('error', 'Something went wrong.');
            return res.redirect('/profile');
        }
    };

    if (!errors.isEmpty()) {
        return renderWithErrors(errors.array());
    }

    try {
        const currentUser = await findUserById(userId);

        if (!currentUser) {
            req.flash('error', 'User not found.');
            return res.redirect('/');
        }

        const updates = {};
        const { username, newPassword, currentPassword } = req.body;

        // Handle username change
        const newUsername = username.trim();
        if (newUsername.toLowerCase() !== currentUser.usernameLower) {
            const existing = await findUserByUsername(newUsername);
            if (existing && existing.id !== userId) {
                return renderWithErrors([{ msg: 'That username is already taken' }]);
            }
            updates.username = newUsername;
        }

        // Handle password change
        if (newPassword) {
            if (!verifyPassword(currentPassword, currentUser.passwordSalt, currentUser.passwordHash)) {
                return renderWithErrors([{ msg: 'Current password is incorrect' }]);
            }
            const salt = randomBytes(16).toString("hex");
            const hash = scryptSync(newPassword, salt, 64).toString("hex");
            updates.passwordHash = hash;
            updates.passwordSalt = salt;
        }

        await updateUser(userId, updates);

        // Refresh session username if it changed
        if (updates.username) {
            req.session.user = { ...req.session.user, username: updates.username };
            await new Promise((resolve, reject) =>
                req.session.save((err) => (err ? reject(err) : resolve()))
            );
        }

        req.flash('success', 'Profile updated successfully.');
        return res.redirect('/profile');
    } catch (error) {
        console.error('Error updating profile:', error);
        return renderWithErrors([{ msg: 'Unable to update profile. Please try again later.' }]);
    }
};

export { showProfilePage, handleProfileUpdate, profileValidation };
