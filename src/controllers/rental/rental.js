import { body, validationResult } from 'express-validator';
import {
    createRental,
    findById,
    getAllRentals,
    getCurrentRentals,
    checkAvailability
} from '../../models/rental/rental.js'; 

const showRentalForm = (req, res) => {
    res.render('rental/form', {
        title: 'Reserve a Dumpster'
    });
};

const handleRentalSubmission = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.error('Validation errors:', errors.array());
        return res.status(400).render('rental/form', {
            title: 'Reserve a Dumpster',
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
        agreement: req.body.agreement === "on",
        userId: req.session.user.id
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
            return res.render('rental/confirmation', {
                title: 'Rental Details Confirmation',
                data: {
                    ...createdRental,
                    deliveryDate: formatDate(createdRental.deliveryDate),
                    pickupDate: formatDate(createdRental.pickupDate)
                }
            });
    } catch (error) {
        console.error('Error saving rental form:', error);
        return res.status(500).render("rental/form", {
            title: 'Reserve a Dumpster',
            errors: [{ msg: "Unable to submit your rental. Please try again later." }],
            form: req.body
        });
    }   
};

const showRentalConfirmation = async (req, res, next) => {
    try {
        const rentalId = req.params.id;
        const rental = await findById(rentalId);

        if (!rental) {
            const err = new Error(`Rental "${rentalId}" not found.`);
            err.status = 404;
            return next(err);
        }

        res.render('rental/confirmation', {
            title: 'Reserve a Dumpster',
            data: rental
        });
    } catch (error) {
        return next(error);
    }
};

const showAllRentals = async (req, res) => {
    let rentals = [];

    try {
        rentals = await getAllRentals();
    } catch (error) {
        console.error('Error retrieving rentals:', error);
    }

    res.render('rental/list', { 
        rentals, 
        title: 'All Rentals'
    });

};

const showCurrentRentals = async (req, res) => {
    let activeRentals = [];

    try {
        activeRentals = await getCurrentRentals();
    } catch (error) {
        console.error('Error retrieving rentals:', error);
    }

    res.render('rental/list', { 
        rentals: activeRentals, 
        title: 'Current Rentals', 
        emptyMessage: 'No active rentals right now.' 
    });

};

const rentalValidation = [
    body('name')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Name must be at least 2 characters'),
    body('phone')
        .trim()
        .isMobilePhone()
        .withMessage('Please enter a valid phone number'),
    body('organization')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 3 })
        .withMessage('Organization must be at least 3 characters'),
    body('address')
        .trim(),
    body('placement')
        .trim()
        .notEmpty()
        .withMessage('Please provide placement instructions')
]

const handleCheckAvailability = async (req, res) => {
    const { size, date } = req.query;
    try {
        const available = await checkAvailability(size, date);
        res.json({ available });  // was missing entirely
    } catch (error) {
        console.error('Availability check failed:', error);
        res.status(500).json({ available: false });
    }
};

const requireRentalOwner = async (req, res) => {
    if (!req.session.user) {
        req.flash('error', 'You must be logged in');
        return res.redirect('/login');
    }
    const rentalId = parseInt(req.params.id);
    const rental = findById(rentalId);

    const isOwner = req.session.user.user_id === rental.userId;
    if (isOwner) {
        return next();
    }
    req.flash('error', 'You do not have permission to access this page');
    return res.redirect('/');
};

export {
    showCurrentRentals,
    showAllRentals, 
    showRentalForm, 
    handleRentalSubmission, 
    rentalValidation, 
    showRentalConfirmation, 
    handleCheckAvailability,
    requireRentalOwner
}