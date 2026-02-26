import { Router } from 'express';
import { body, validationResult } from 'express-validator';

const router = Router();

/**
 * Display the rental form page.
 */
const showRentalForm = (req, res) => {
    res.render('forms/rental/form', {
        title: 'Reserve a Dumpster'
    });
};

/**
 * Handle rental form submission with validation.
 * If validation passes, save to database and redirect.
 * If validation fails, log errors and redirect back to form.
 */
const handleRentalSubmission = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // Store each validation error as a separate flash message
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });
        return res.redirect('/rental');
    }

    // Extract validated data
    const { subject, message } = req.body;

    try {
        // Save to database
        await createContactForm(subject, message);
        // After successfully saving to the database
        req.flash('success', 'Thank you for reserving a dumpster.');
        // Redirect to responses page on success
        res.redirect('/rental');
    } catch (error) {
        console.error('Error saving contact form:', error);
        req.flash('error', 'Unable to submit your rental. Please try again later.');
        res.redirect('/rental');
    }   
};

/**
 * Display current rentals.
 */
const showCurrentRentals = async (req, res) => {
    let rentals = [];

    try {
        rentals = await findCurrent();
    } catch (error) {
        console.error('Error retrieving rentals:', error);
    }

    res.render('rental/current', {
        title: 'Current Rentals',
        contactForms
    });
};

/**
 * GET /rental - Display the rental form
 */
router.get('/', showRentalForm);

/**
 * POST /rental - Handle rental form submission with validation
 */
router.post('/',
    [
        body('name')
            .trim()
            .isLength({ min: 2 })
            .withMessage('Name must be at least 2 characters'),
        body('phone')
            .trim(),
        body('organization')
            .trim()
            .isLength({ min: 3 })
            .withMessage('Organization must be at least 3 characters'),
        body('address')
            .trim(),
        body('placement')
            .trim()
    ],
    handleRentalSubmission
);

/**
 * GET /contact/current - Display all current rentals
 */
router.get('/current', showCurrentRentals);

export default router;