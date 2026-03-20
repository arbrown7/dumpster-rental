import { homePage, aboutPage, faqPage } from './index.js';
import { Router } from 'express';

import { 
  showRentalForm, 
  handleRentalSubmission, 
  rentalValidation, 
  showRentalConfirmation, 
  handleCheckAvailability 
} from './rental/rental.js';

import { 
  showRegisterPage, 
  registerUser, 
  registerValidation 
} from './auth/register.js';

import { 
  showLoginPage, 
  loginUser, 
  loginValidation 
} from './auth/login.js';

// Create a new router instance
const router = Router();

// Home and basic pages
router.get('/', homePage);
router.get('/about', aboutPage);
router.get('/faq', faqPage);
router.get('/register', showRegisterPage);
router.post('/register', registerValidation, registerUser);
router.get('/login', showLoginPage);
router.post('/login', loginValidation, loginUser);

// Rental form routes
router.get('/rental', showRentalForm);
router.post('/rental', rentalValidation, handleRentalSubmission);
router.get('/rental/:id/confirmation', showRentalConfirmation);
router.get('/availability', handleCheckAvailability);

export default router;