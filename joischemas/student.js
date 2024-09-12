const Joi = require("joi")

const createStudentSchema = Joi.object({
    firstName: Joi.string().max(255).required(),
    middleName: Joi.string().max(255).required(),
    lastName: Joi.string().max(255).required(),
    sourceOfIncome: Joi.string().max(255).required(),
    gender: Joi.string().valid("Male", "Female", "Other").required(),
    class: Joi.string().required().max(255),
    dob: Joi.string()
        .isoDate().allow(null)
        .messages({
            'string.isoDate': 'dob must be a valid ISO date(YYYY-MM-DD)',
        }).required(),
    phoneNumber: Joi.string()
        .pattern(/^[0-9]{1,11}$/)
        .min(10)
        .max(11)
        .messages({
            'string.pattern.base': 'phoneNumber must be a numeric string with a maximum length of 11',
            'string.max': 'phoneNumber must have a maximum length of 11',
        }).required(),
    email: Joi.string().email().max(255).required(),
    zip: Joi.string().max(10).required()
})

const validateCreateStudent = (body) => createStudentSchema.validate(body);



module.exports = { validateCreateStudent }