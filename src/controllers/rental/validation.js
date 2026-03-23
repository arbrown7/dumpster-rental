import { body } from 'express-validator';

const rentalValidation = [
    body('name')
        .trim()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage('Name must be at least 2 characters'),
    body('phone')
        .trim()
        .notEmpty()
        .isMobilePhone()
        .withMessage('Please enter a valid phone number'),
    body('organization')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 3 })
        .withMessage('Organization must be at least 3 characters'),
    body('address')
        .trim()
        .notEmpty()
        .isLength({ min: 5 })
        .withMessage('Address must be at least 5 characters'),
    body('placement')
        .trim()
        .notEmpty()
        .withMessage('Please provide placement instructions')
]

const rentalEditValidation = [
    body('name')
        .trim()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage('Name must be at least 2 characters'),
    body('phone')
        .trim()
        .notEmpty()
        .isMobilePhone()
        .withMessage('Please enter a valid phone number'),
    body('organization')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 3 })
        .withMessage('Organization must be at least 3 characters'),
    body('address')
        .trim()
        .notEmpty()
        .isLength({ min: 5 })
        .withMessage('Address must be at least 5 characters'),
    body('placement')
        .trim()
        .notEmpty()
        .withMessage('Please provide placement instructions'),
    body('receiptNo')
        .if(body('status').equals('paid'))
        .notEmpty()
        .withMessage('Receipt number is required when status is paid'),
    body('status')
        .isIn(['pending', 'paid', 'cancelled', 'completed'])
        .withMessage('Invalid status value'),
]

export {
    rentalEditValidation,
    rentalValidation
}