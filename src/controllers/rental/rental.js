import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import {
    createRental,
    findByUserId,
    findById,
    findCurrent,
    findHistory,
    updateStatus
} from '../../models/rental/rental.js'; 

const router = Router();

/**
 * Display the rental form page.
 */
const showRentalForm = (req, res) => {
    res.render('rental/form', {
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
        console.error('Validation errors:', errors.array());
        // Best UX: re-render form with errors + previously entered values
        return res.status(400).render("rental/form", {
        title: "Reserve a Dumpster",
        errors: errors.array(),
        form: req.body
        });
    }

    const rentalInput = {
        size: req.body.size,
        name: req.body.name,
        phone: req.body.phone,
        organization: req.body.organization,
        address: req.body.address,
        placement: req.body.placement,
        deliveryDate: req.body.deliveryDate,
        pickupDate: req.body.pickupDate,
        agreement: req.body.agreement === "on"
        // userId: req.user?.id ?? null  // later when auth exists
    };

    try {
        // Save to database
        const createdRental = await createRental(rentalInput);
        // After successfully saving to the database
        const formatDate = (tsOrString) => {
            if (!tsOrString) return "";
            // If Firestore Timestamp:
            if (typeof tsOrString.toDate === "function") {
                return tsOrString.toDate().toLocaleDateString("en-US");
            }
            // If already string "YYYY-MM-DD":
            return tsOrString;
        };
        // Redirect to responses page on success
            return res.render("rental/confirmation", {
                data: {
                    ...createdRental,
                    deliveryDate: formatDate(createdRental.deliveryDate),
                    pickupDate: formatDate(createdRental.pickupDate)
                }
            });
    } catch (error) {
        console.error('Error saving contact form:', error);
        return res.status(500).render("rental/form", {
            title: "Reserve a Dumpster",
            errors: [{ msg: "Unable to submit your rental. Please try again later." }],
            form: req.body
        });
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

const rentalValidation = [
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
]

export {showCurrentRentals, showRentalForm, handleRentalSubmission, rentalValidation}