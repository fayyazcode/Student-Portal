const Joi = require("joi")

const createStudentSchema = Joi.object({
    firstName: Joi.string().max(255).required(),
    middleName: Joi.string().max(255).required(),
    lastName: Joi.string().max(255).required(),
    chartIncome: Joi.number().max(99999999999).required(),
    gender: Joi.string().valid("Male", "Female", "Other").required(),
    class: Joi.string().required().max(255),
    note: Joi.string().required().max(500),
    dob: Joi.string()
        .isoDate().allow(null)
        .messages({
            'string.isoDate': 'dob must be a valid ISO date(YYYY-MM-DD)',
        }).required(),
    doj: Joi.string()
        .isoDate().allow(null)
        .messages({
            'string.isoDate': 'dob must be a valid ISO date(YYYY-MM-DD)',
        }).required(),
    phoneNumber1: Joi.string()
        .pattern(/^[0-9]{1,11}$/)
        .min(10)
        .max(11)
        .messages({
            'string.pattern.base': 'phoneNumber must be a numeric string with a maximum length of 11',
            'string.max': 'phoneNumber must have a maximum length of 11',
        }).required(),
    phoneNumber2: Joi.string()
        .pattern(/^[0-9]{1,11}$/)
        .min(10)
        .max(11)
        .messages({
            'string.pattern.base': 'phoneNumber must be a numeric string with a maximum length of 11',
            'string.max': 'phoneNumber must have a maximum length of 11',
        }),
    email: Joi.string().email().max(255).required(),
    zip: Joi.string().max(10).required()
})

const validateCreateStudent = (body) => createStudentSchema.validate(body);


const updateStudentSchema = Joi.object({
    firstName: Joi.string().max(255),
    middleName: Joi.string().max(255),
    lastName: Joi.string().max(255),
    chartIncome: Joi.number().max(99999999999),
    gender: Joi.string().valid("Male", "Female", "Other"),
    class: Joi.string().max(255),
    note: Joi.string().max(500),
    dob: Joi.string()
        .isoDate().allow(null)
        .messages({
            'string.isoDate': 'dob must be a valid ISO date(YYYY-MM-DD)',
        }),
    doj: Joi.string()
        .isoDate().allow(null)
        .messages({
            'string.isoDate': 'dob must be a valid ISO date(YYYY-MM-DD)',
        }),
    phoneNumber1: Joi.string()
        .pattern(/^[0-9]{1,11}$/)
        .min(10)
        .max(11)
        .messages({
            'string.pattern.base': 'phoneNumber must be a numeric string with a maximum length of 11',
            'string.max': 'phoneNumber must have a maximum length of 11',
        }),
    phoneNumber2: Joi.string()
        .pattern(/^[0-9]{1,11}$/)
        .min(10)
        .max(11)
        .messages({
            'string.pattern.base': 'phoneNumber must be a numeric string with a maximum length of 11',
            'string.max': 'phoneNumber must have a maximum length of 11',
        }),
    email: Joi.string().email().max(255),
    zip: Joi.string().max(10)
});

const validateUpdateStudent = (body) => updateStudentSchema.validate(body);


module.exports = { validateCreateStudent, validateUpdateStudent }