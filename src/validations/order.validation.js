const Joi = require('joi');

const createOrderSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        groceryItemId: Joi.string().uuid().required(),
        quantity: Joi.number().integer().min(1).required(),
      })
    )
    .min(1)
    .required(),
});

module.exports = {
  createOrderSchema,
};