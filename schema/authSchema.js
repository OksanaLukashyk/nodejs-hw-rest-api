const Joi = require("joi");

const emailRegexp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

const authUserSchema = Joi.object({
  email: Joi.string()
    .required()
    .pattern(emailRegexp)
    .messages({ "any.required": "missing required email field" }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({ "any.required": "missing required password field" }),
});

const subscrSchema = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business").required(),
});

const verifyEmailSchema = Joi.object({
  email: Joi.string()
    .pattern(emailRegexp)
    .required()
    .messages({ "any.required": "Missing required field email" }),
});

module.exports = { authUserSchema, subscrSchema, verifyEmailSchema };
