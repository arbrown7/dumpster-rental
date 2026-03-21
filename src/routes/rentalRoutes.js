import { Router } from "express";
import {
    showRentalForm,
    handleRentalSubmission,
    rentalValidation,
    showRentalConfirmation,
    handleCheckAvailability,
    showCurrentRentals,
    showAllRentals,
    requireRentalOwner
} from "../controllers/rental/rental.js";
import {
    requireRole,
    requireLogin
} from "../middleware/auth.js";

const rentalRoutes = Router();

rentalRoutes.get("/rental", requireLogin, showRentalForm);
rentalRoutes.post("/rental", requireLogin, rentalValidation, handleRentalSubmission);
rentalRoutes.get("/rental/current", requireRole('admin'), showCurrentRentals);
rentalRoutes.get("/rental/all", requireRole('admin'), showAllRentals);
rentalRoutes.get("/rental/:id/confirmation", requireRentalOwner, showRentalConfirmation);
rentalRoutes.get("/availability", requireLogin, handleCheckAvailability);


export default rentalRoutes;
