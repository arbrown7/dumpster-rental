import { homePage, aboutPage, faqPage } from './index.js';
import { Router } from 'express';
import { showRentalForm, handleRentalSubmission, rentalValidation } from './rental/rental.js';

// Create a new router instance
const router = Router();

// Home and basic pages
router.get('/', homePage);
router.get('/about', aboutPage);
router.get('/faq', faqPage);

// Rental form routes
router.get('/rental', showRentalForm);
router.post('/rental', rentalValidation, handleRentalSubmission);

export default router;