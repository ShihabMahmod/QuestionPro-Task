const Joi = require('joi');

const createItemSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  price: Joi.number().positive().precision(2).required(),
  inventoryCount: Joi.number().integer().min(0).default(0),
});

const updateItemSchema = Joi.object({
  name: Joi.string().min(3).max(100),
  price: Joi.number().positive().precision(2),
  inventoryCount: Joi.number().integer().min(0),
}).min(1);

const updateInventorySchema = Joi.object({
  inventoryCount: Joi.number().integer().min(0).required(),
});

module.exports = {
  createItemSchema,
  updateItemSchema,
  updateInventorySchema,
};