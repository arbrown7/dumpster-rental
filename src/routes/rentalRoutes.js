import { Router } from "express";
import {
    showRentalForm,
    handleRentalSubmission,
    rentalValidation,
    showRentalConfirmation,
    handleCheckAvailability,
    showCurrentRentals,
    showAllRentals,
    requireRentalOwner,
    showEditRental,
    handleEditRental,
    rentalEditValidation,
    //showRentalEditConfirmation
} from "../controllers/rental/rental.js";
import {
    requireRole,
    requireLogin
} from "../middleware/auth.js";

const rentalRoutes = Router();

rentalRoutes.use('/rental', (req, res, next) => {
    res.addScript('<script src="/js/rentalForm.js"></script>');
    next();
});

rentalRoutes.get("/rental", requireLogin, showRentalForm);
rentalRoutes.post("/rental", requireLogin, rentalValidation, handleRentalSubmission);
rentalRoutes.get("/rental/current", requireRole('admin'), showCurrentRentals);
rentalRoutes.get("/rental/all", requireRole('admin'), showAllRentals);
rentalRoutes.get("/rental/:id/edit", requireRole('admin'), showEditRental);
rentalRoutes.post("/rental/:id/edit", requireRole('admin'), rentalEditValidation, handleEditRental); 
//entalRoutes.get("/rental/:id/edit/confirmation", requireRole('admin'), showRentalEditConfirmation);
rentalRoutes.get("/rental/:id/confirmation", requireRentalOwner, showRentalConfirmation);
rentalRoutes.get("/availability", requireLogin, handleCheckAvailability);


export default rentalRoutes;
