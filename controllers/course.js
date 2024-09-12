const { validateCreateCourse, validateUpdateCourse } = require("../joischemas/course");
const Course = require("../models/courseModel")
const CourseImage = require("../models/courseImageModel")
const { resWrapper } = require("../utils");
const { uploadMultipleToCloudinary } = require("../utils/cloudinary");
const CourseCategory = require("../models/courseCategoryModel");
const Enrollment = require("../models/enrollment");
const Student = require("../models/studentModel");

const includeObj = {
    include: [
        { model: CourseImage, as: "images", attributes: { exclude: ["courseId"] } },
        { model: CourseCategory, as: "category" }
    ]
};

const createCourse = async (req, res) => {
    const { error, value } = validateCreateCourse(req.body)

    if (error) return res.status(400).send(resWrapper(error.message, 400, null, error.message));

    const categroy = await CourseCategory.findByPk(value.categoryId);
    if (!categroy) return res.status(404).send(resWrapper("Category Not Found", 404, null, "Category Id Is Not Valid"))

    const response = await uploadMultipleToCloudinary(req.files, "course");
    if (!response.isSuccess) return res.status(400).send(resWrapper("Image upload Error. Try again", 400, "Images can't be upload at the moment try again later"))

    if (response.data.length === 0) return res.status(400).send(resWrapper("Image upload Error. Try again", 400, "Images can't be upload at the moment try again later"));

    const course = await Course.create({ ...value });

    const courseImages = response.data.map(url => ({
        url,
        courseId: course.id,
    }));

    await CourseImage.bulkCreate(courseImages);

    const temp = await Course.findByPk(course.id, {
        ...includeObj
    })

    return res.status(201).send(resWrapper("Course Created", 201, temp))

}

const getAllCourses = async (req, res) => {
    const courses = await Course.findAll({
        ...includeObj
    });

    return res.status(200).send(resWrapper("Courses Reterived", 200, courses))

}

const getACourse = async (req, res) => {
    const id = req.params.id;

    const course = await Course.findByPk(id, {
        ...includeObj
    });

    if (!course) return res.status(404).send(resWrapper("Course Not Found", 404, null, "Id is not valid"))

    return res.status(200).send(resWrapper("Courses Reterived", 200, course))

}

const deleteACourse = async (req, res) => {
    const id = req.params.id;

    const course = await Course.findByPk(id, {
        ...includeObj
    });
    if (!course) return res.status(404).send(resWrapper("Course Not Found", 404, null, "Id Is Not Valid"))

    await course.destroy();

    return res.status(200).send(resWrapper("Course Deleted", 200, course));
}

const updateACourse = async (req, res) => {
    const id = req.params.id;

    const { error, value } = validateUpdateCourse(req.body)
    if (error) return res.status(400).send(resWrapper(error.message, 400, null, error.message));

    const course = await Course.findByPk(id);
    if (!course) return res.status(404).send(resWrapper("Course Not Found", 404, null, "Id Is Not Valid"))

    // To Delete Previous Images 
    if (value.deletedImages?.length) {
        await CourseImage.destroy({
            where: {
                id: value.deletedImages,
                courseId: id
            }
        });
    }

    // To Add New Images
    if (req.files && req.files.length) {
        const response = await uploadMultipleToCloudinary(req.files, "course");
        if (!response.isSuccess) return res.status(400).send(resWrapper("Image upload Error. Try again", 400, "Images can't be upload at the moment try again later"))

        if (response.data.length === 0) return res.status(400).send(resWrapper("Image upload Error. Try again", 400, "Images can't be upload at the moment try again later"));

        const courseImages = response.data.map(url => ({
            url,
            courseId: course.id,
        }));

        await CourseImage.bulkCreate(courseImages);
    }

    if (value.categoryId) {
        const category = await CourseCategory.findByPk(value.categoryId);
        if (!category) return res.status(404).send(resWrapper("Category Dosn't Exist", 404, null, "Category Id Is Not Valid"));

        await course.update({ ...value })
    } else {
        await course.update({ ...value });
    }

    const updatedCourse = await Course.findByPk(id, { ...includeObj })
    return res.status(200).send(resWrapper("Course Updated", 200, updatedCourse))

}

const getAllStudentsOfACourse = async (req, res) => {
    const id = req.params.id;

    const course = await Course.findByPk(id);
    if (!course) return res.status(404).send(resWrapper("Course Not Found", 404, null, "Id Is Not Valid"))

    const allStudents = await Enrollment.findAll({
        where: {
            courseId: id
        },
        include: [
            { model: Student, as: "student" },
            {
                model: Course, as: "course", include: [
                    {
                        model: CourseImage, as: "images", attributes: {
                            exclude: ["courseId"]
                        }
                    },
                    {
                        model: CourseCategory, as: "category"
                    }
                ]
            }
        ]
    });

    return res.status(200).send(resWrapper("All Students Of Course", 200, allStudents))

}

module.exports = { createCourse, getAllCourses, getACourse, deleteACourse, updateACourse, getAllStudentsOfACourse }