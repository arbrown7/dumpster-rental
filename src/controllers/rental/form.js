import { validationResult } from 'express-validator';
import {
    createRental,
    findById,
    checkHistory
} from '../../models/rental/rental.js'; 
import {
    formatDate
} from '../rental/helpers.js';

const showRentalForm = (req, res) => {
    if (!req.session.user) {
        req.flash('error', 'You must be logged in');
        return res.redirect('/login');
    }
    res.render('rental/form', {
        title: 'Reserve a Dumpster'
    });
};

const handleRentalSubmission = async (req, res) => {
    if (!req.session.user) {
        req.flash('error', 'You must be logged in');
        return res.redirect('/login');
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.error('Validation errors:', errors.array());
        return res.status(400).render('rental/form', {
            title: 'Reserve a Dumpster',
            errors: errors.array(),
            form: req.body
        });
    }

    const rentalHistory = await checkHistory(req.session.user.id);
    if (rentalHistory.length >= 3) {
        req.flash('error', 'You cannot reserve more than 3 rentals per calendar year.');
        return res.redirect('/');
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
    if (!req.session.user) {
        req.flash('error', 'You must be logged in');
        return res.redirect('/login');
    }
    
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

export {
    showRentalConfirmation,
    showRentalForm,
    handleRentalSubmission
};