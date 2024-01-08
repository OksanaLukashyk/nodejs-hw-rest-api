const Joi = require("joi");

const addSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "missing required name field",
  }),
  email: Joi.string()
    .required()
    .messages({ "any.required": "missing required email field" }),
  phone: Joi.string()
    .required()
    .messages({ "any.required": "missing required phone field" }),
});

const updSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
});

module.exports = { addSchema, updSchema };
