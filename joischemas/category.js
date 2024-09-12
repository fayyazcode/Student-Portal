const Joi = require("joi")

const categorySchema = Joi.object({
    title: Joi.string().max(255).required()
});

const validateCreateCategory = (body) => categorySchema.validate(body);


module.exports = { validateCreateCategory }