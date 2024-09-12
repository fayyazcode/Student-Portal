const Joi = require("joi")

const createAdminSchema = Joi.object({
    name: Joi.string().max(255).required(),
    email: Joi.string().email().max(255).required(),
    password: Joi.string().min(8).max(255).required(),
    confirmPassword: Joi.string().required().valid(Joi.ref('password')),
});

const validateCreateAdminSchema = (body) => createAdminSchema.validate(body);


const loginAdminSchema = Joi.object({
    email: Joi.string().email().max(255).required(),
    password: Joi.string().min(8).max(255).required(),
});

const validateLoginAdmin = (body) => loginAdminSchema.validate(body);

module.exports = { validateCreateAdminSchema, validateLoginAdmin }