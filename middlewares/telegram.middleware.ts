import { body } from 'express-validator';

export const validateInitDataMiddleware = [
  body('initData').not().isEmpty().withMessage('Can not be empty').isString().withMessage('Should be a string'),
];

export const validateProgressDataMiddleware = [
  body('telegramUserId').not().isEmpty().withMessage('Can not be empty').isNumeric().withMessage('Should be a number'),
  body('coins').not().isEmpty().withMessage('Can not be empty').isNumeric().withMessage('Should be a number'),
];
