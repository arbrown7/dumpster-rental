import {
    findById
} from '../../models/rental/rental.js'; 

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

const showMyRentals = async (req, res) => {
  const rentals = await getUserRentals(req.session.user.id);
  res.render('rental/my-rentals', { title: 'My Rentals', rentals });
};

export {
    requireRentalOwner,
    showMyRentals
}