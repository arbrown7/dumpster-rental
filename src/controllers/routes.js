import { homePage, aboutPage, faqPage } from './index.js';
import { Router } from 'express';
import { showRentalForm, handleRentalSubmission, rentalValidation, showRentalConfirmation } from './rental/rental.js';

// Create a new router instance
const router = Router();

// Home and basic pages
router.get('/', homePage);
router.get('/about', aboutPage);
router.get('/faq', faqPage);

// Rental form routes
router.get('/rental', showRentalForm);
router.post('/rental', rentalValidation, handleRentalSubmission);
router.get('/rental/:id/confirmation', showRentalConfirmation);

export default router;