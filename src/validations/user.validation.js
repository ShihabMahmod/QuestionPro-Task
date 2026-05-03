const Joi = require('joi');


const getAvailableItemsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().min(1).max(100).optional(),
  minPrice: Joi.number().positive().precision(2).optional(),
  maxPrice: Joi.number().positive().precision(2).optional(),
}).unknown(false); 


const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  email: Joi.string().email().optional(),
  currentPassword: Joi.string().when('newPassword', {
    is: Joi.exist(),
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  newPassword: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .message('Password must contain at least one uppercase, one lowercase, one number, and one special character')
    .optional(),
}).min(1);

// For getting user orders with pagination
const getUserOrdersSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).optional(),
}).unknown(false);


const addItemReviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().max(500).optional(),
}).required();

module.exports = {
  getAvailableItemsSchema,
  updateProfileSchema,
  getUserOrdersSchema,
  addItemReviewSchema,
};