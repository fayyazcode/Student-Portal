const { resWrapper } = require("../utils");
const { validateCreateCategory } = require("../joischemas/category");

const CourseCategory = require("../models/courseCategoryModel");


const createCategory = async (req, res) => {
    const { error, value } = validateCreateCategory(req.body)

    if (error) return res.status(400).send(resWrapper(error.message, 400, null, error.message));

    const prevCat = await CourseCategory.findOne({
        where: {
            title: value.title
        }
    });
    if (prevCat) return res.status(400).send(resWrapper("Category Already Exist", 400, null, "Can Add Already Created Category"))

    const category = await CourseCategory.create({ ...value });

    return res.status(201).send(resWrapper("Course Created", 201, category))

}

// const getAllCourses = async (req, res) => {
//     const courses = await Course.findAll({
//         ...includeObj
//     });

//     return res.status(200).send(resWrapper("Courses Reterived", 200, courses))

// }

// const getACourse = async (req, res) => {
//     const id = req.params.id;

//     const course = await Course.findByPk(id, {
//         ...includeObj
//     });

//     if (!course) return res.status(404).send(resWrapper("Course Not Found", 404, null, "Id is not valid"))

//     return res.status(200).send(resWrapper("Courses Reterived", 200, course))

// }

module.exports = { createCategory }