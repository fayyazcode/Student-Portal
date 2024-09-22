const Joi = require("joi")


const createAttendanceSchema = Joi.object({
    studentId: Joi.string().required(),
    courseId: Joi.string().required(),
    date: Joi.string()
        .isoDate().allow(null)
        .messages({
            'string.isoDate': 'dob must be a valid ISO date(YYYY-MM-DD)',
        }).required(),
    isPresent: Joi.boolean().required()
});

const validateCreateAttendance = (body) => createAttendanceSchema.validate(body);


const updateAttendanceSchema = Joi.object({
    date: Joi.string()
        .isoDate().allow(null)
        .messages({
            'string.isoDate': 'dob must be a valid ISO date(YYYY-MM-DD)',
        }),
    isPresent: Joi.boolean()
})

const validateUpdateAttendance = (body) => updateAttendanceSchema.validate(body)


const getUniqueStudentInQuaterSchema = Joi.object({
    quater: Joi.string().valid("Q1", "Q2", "Q3", "Q4").required()
});

const validateUniqueStudentInQuater = (body) => getUniqueStudentInQuaterSchema.validate(body)

const yearSchema = Joi.object({
    year: Joi.number()
        .integer()
        .min(1900) // Minimum valid year
        .max(new Date().getFullYear()) // Maximum is the current year
        .required() // Ensure year is required, remove this line if not needed
});

const validateYear = (body) => yearSchema.validate(body)

module.exports = { validateCreateAttendance, validateUpdateAttendance, validateUniqueStudentInQuater, validateYear }