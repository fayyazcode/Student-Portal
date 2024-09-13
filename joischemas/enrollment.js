const Joi = require("joi")


const createEnrollmentSchmea = Joi.object({
    studentId: Joi.string().required(),
    courseId: Joi.string().required(),
});

const validateCreateEnrollment = (body) => createEnrollmentSchmea.validate(body);

module.exports = { validateCreateEnrollment }