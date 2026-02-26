import { homePage, aboutPage, faqPage } from './index.js';
import { Router } from 'express';

// Create a new router instance
const router = Router();

// Home and basic pages
router.get('/', homePage);
router.get('/about', aboutPage);
router.get('/faq', faqPage);

// Rental form routes
router.use('/rental', rentalRoutes);

export default router;