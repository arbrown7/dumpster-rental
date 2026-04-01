import { validationResult } from 'express-validator';
import {
    findById,
    getAllRentals,
    getCurrentRentals,
    updateRental,
    getFutureRentals
} from '../../models/rental/rental.js'; 
import {
    formatDateTime
} from '../rental/helpers.js';

const showAllRentals = async (req, res) => {
    if (!req.session.user) {
        req.flash('error', 'You must be logged in');
        return res.redirect('/login');
    }

    const { search = '', status = '', paid = '', size = '' } = req.query;

    let rentals = [];

    try {
        rentals = await getAllRentals();
    } catch (error) {
        console.error('Error retrieving rentals:', error);
    }

    if (search) {
        const q = search.toLowerCase();
        rentals = rentals.filter(r =>
            (r.name && r.name.toLowerCase().includes(q)) ||
            (r.phone && r.phone.toLowerCase().includes(q)) ||
            (r.address && r.address.toLowerCase().includes(q)) ||
            (r.organization && r.organization.toLowerCase().includes(q))
        );
    }
    if (status) rentals = rentals.filter(r => r.status === status);
    if (paid === 'true')  rentals = rentals.filter(r => r.paid === true);
    if (paid === 'false') rentals = rentals.filter(r => r.paid === false);
    if (size)   rentals = rentals.filter(r => r.size === size);

    res.render('rental/list', { 
        rentals, 
        title: 'All Rentals',
        isAdmin: true,
        filters: { search, status, paid, size },
        clearFiltersUrl: '/rental/all',
        showStatusFilter: true,
        showPaidFilter: true
    });

};

const showCurrentRentals = async (req, res) => {
    if (!req.session.user) {
        req.flash('error', 'You must be logged in');
        return res.redirect('/login');
    }

    const { search = '', size = '' } = req.query;

    let activeRentals = [];

    try {
        activeRentals = await getCurrentRentals();
    } catch (error) {
        console.error('Error retrieving rentals:', error);
    }

    if (search) {
        const q = search.toLowerCase();
        activeRentals = activeRentals.filter(r =>
            (r.name && r.name.toLowerCase().includes(q)) ||
            (r.phone && r.phone.toLowerCase().includes(q)) ||
            (r.address && r.address.toLowerCase().includes(q)) ||
            (r.organization && r.organization.toLowerCase().includes(q))
        );
    }
    if (size) activeRentals = activeRentals.filter(r => r.size === size);

    res.render('rental/list', { 
        rentals: activeRentals, 
        title: 'Current Rentals', 
        emptyMessage: 'No active rentals right now.',
        isAdmin: true,
        filters: { search, status: 'active', paid: 'true', size },
        clearFiltersUrl: '/rental/current',
        showStatusFilter: false,
        showPaidFilter: false
    });

};

const showEditRental = async (req, res) => {
    if (!req.session.user) {
        req.flash('error', 'You must be logged in');
        return res.redirect('/login');
    }

    const rentalId = req.params.id;
    
    try {
        const rental = await findById(rentalId);

        res.render('rental/edit', {
            title: 'Edit Rental',
            targetRentalId: rentalId,
            rental: {
                ...rental,
                createdAt: formatDateTime(rental.createdAt),
                lastUpdated: formatDateTime(rental.lastUpdated)
            }
        });
    } catch (error) {
        console.error('Error retrieving rental', error);
        req.flash('error', 'Unable to find rental, please try again later.');
        return res.redirect('/rental/all');
    }
};

const handleEditRental = async (req, res) => {
    if (!req.session.user) {
        req.flash('error', 'You must be logged in');
        return res.redirect('/login');
    }
    
    const errors = validationResult(req);
    const rentalId = req.params.id;

    if (!errors.isEmpty()) {
        errors.array().forEach(error => req.flash('error', error.msg));
        return res.redirect(`/rental/${rentalId}/edit`);
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
        receiptNo: req.body.receiptNo ?? "",
        status: req.body.status
    };

    try {
        // Save to database
        const updatedRental = await updateRental(rentalId, rentalInput);
        // Redirect to responses page on success
        return res.render('rental/edit-confirmation', {
            title: 'Rental Details Succesfully Updated',
            data: updatedRental
        });
    } catch (error) {
        console.error('Error saving rental form:', error);
        return res.status(500).render("rental/form", {
            title: 'Reserve a Dumpster',
            errors: [{ msg: "Unable to update rental. Please try again later." }],
            form: req.body
        });
    }   
};

// const showRentalEditConfirmation = async (req, res, next) => {
//     try {
//         const rentalId = req.params.id;
//         const rental = await findById(rentalId);

//         if (!rental) {
//             const err = new Error(`Rental "${rentalId}" not found.`);
//             err.status = 404;
//             return next(err);
//         }

//         res.render('rental/edit-confirmation', {
//             title: 'Reserve a Dumpster',
//             data: rental
//         });
//     } catch (error) {
//         return next(error);
//     }
// };

const showFutureRentals = async (req, res) => {
    if (!req.session.user) {
        req.flash('error', 'You must be logged in');
        return res.redirect('/login');
    }

    const { search = '', size = '' } = req.query;

    let futureRentals = [];

    try {
        futureRentals = await getFutureRentals();
    } catch (error) {
        console.error('Error retrieving rentals:', error);
    }


    if (search) {
        const q = search.toLowerCase();
        futureRentals = futureRentals.filter(r =>
            (r.name && r.name.toLowerCase().includes(q)) ||
            (r.phone && r.phone.toLowerCase().includes(q)) ||
            (r.address && r.address.toLowerCase().includes(q)) ||
            (r.organization && r.organization.toLowerCase().includes(q))
        );
    }
    if (size) futureRentals = futureRentals.filter(r => r.size === size);

    res.render('rental/list', { 
        rentals: futureRentals, 
        title: 'Future Rentals', 
        emptyMessage: 'No future rentals to show.',
        isAdmin: true,
        filters: { search, status: '', paid: '', size },
        clearFiltersUrl: '/rental/future',
        showStatusFilter: false,
        showPaidFilter: false
    });

};

export {
    showAllRentals,
    showCurrentRentals,
    showEditRental,
    handleEditRental,
    showFutureRentals
}