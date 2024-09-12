const Joi = require("joi")


const createEnrollmentSchmea = Joi.object({
    studentId: Joi.number().required(),
    courseId: Joi.number().required(),
});

const validateCreateEnrollment = (body) => createEnrollmentSchmea.validate(body);

module.exports = { validateCreateEnrollment }