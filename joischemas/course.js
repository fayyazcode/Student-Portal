const Joi = require("joi")

const createCourseSchema = Joi.object({
    title: Joi.string().required().max(255),
    description: Joi.string().required().max(500),
    status: Joi.string().valid('Published', 'Draft', 'Inactive').required(),
    categoryId: Joi.string().required(),
    images: Joi.array().items(Joi.string()).required()
});

const validateCreateCourse = (body) => createCourseSchema.validate(body);


const updateCourseSchema = Joi.object({
    title: Joi.string().max(255),
    description: Joi.string().max(500),
    status: Joi.string().valid('Published', 'Draft', 'Inactive'),
    categoryId: Joi.string(),
    addImages: Joi.array().items(Joi.string()).when(Joi.exist(), {
        then: Joi.array().min(1)
    }),
    deletedImages: Joi.array().items(Joi.string()).when(Joi.exist(), {
        then: Joi.array().min(1)
    })
});

const validateUpdateCourse = (body) => updateCourseSchema.validate(body)

module.exports = {
    validateCreateCourse,
    validateUpdateCourse
}