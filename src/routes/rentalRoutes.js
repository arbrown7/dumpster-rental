import { Router } from "express";
import {
    showRentalForm,
    handleRentalSubmission,
    rentalValidation,
    showRentalConfirmation,
    handleCheckAvailability,
    showCurrentRentals
} from "../controllers/rental/rental.js";

const rentalRoutes = Router();

rentalRoutes.get("/rental", showRentalForm);
rentalRoutes.post("/rental", rentalValidation, handleRentalSubmission);
rentalRoutes.get("/rental/current", showCurrentRentals);
rentalRoutes.get("/rental/:id/confirmation", showRentalConfirmation);
rentalRoutes.get("/availability", handleCheckAvailability);

export default rentalRoutes;
