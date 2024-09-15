const { validateCreateCourse, validateUpdateCourse } = require("../joischemas/course");
const Course = require("../models/courseModel")
const CourseImage = require("../models/courseImageModel")
const { resWrapper, isValidUuid } = require("../utils");
const { uploadMultipleToCloudinary } = require("../utils/cloudinary");
const CourseCategory = require("../models/courseCategoryModel");
const Enrollment = require("../models/enrollment");
const Student = require("../models/studentModel");
const { Sequelize } = require("sequelize");

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

    const { title, description, status, categoryId, images } = value;
    const course = await Course.create({ title, description, status, categoryId });

    const courseImages = images.map(image => ({
        url: image,
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
        attributes: {
            include: [
                [
                    Sequelize.cast(Sequelize.fn("COUNT", Sequelize.col("enrollments.id")), 'INTEGER'),
                    "totalEnrollments"
                ]
            ]
        },
        include: [
            {
                model: Enrollment,
                as: "enrollments",
                attributes: [] // Avoid fetching individual enrollment records
            },
            { model: CourseImage, as: "images", attributes: { exclude: ["courseId"] } },
            { model: CourseCategory, as: "category" }
        ],
        group: ['Course.id', 'images.id', 'category.id'], // Add images and category fields to the group clause
    });



    return res.status(200).send(resWrapper("Courses Reterived", 200, courses))

}

const getACourse = async (req, res) => {
    const id = req.params.id;
    if (!isValidUuid(id, res)) return;


    const course = await Course.findByPk(id, {
        attributes: {
            include: [
                [
                    Sequelize.cast(Sequelize.fn("COUNT", Sequelize.col("enrollments.id")), 'INTEGER'),
                    "totalEnrollments"
                ]
            ]
        },
        include: [
            {
                model: Enrollment,
                as: "enrollments",
                attributes: [] // Avoid fetching individual enrollment records
            },
            { model: CourseImage, as: "images", attributes: { exclude: ["courseId"] } },
            { model: CourseCategory, as: "category" }
        ],
        group: ['Course.id', 'images.id', 'category.id'], // Add images and category fields to the group clause
    });


    if (!course) return res.status(404).send(resWrapper("Course Not Found", 404, null, "Id is not valid"))

    return res.status(200).send(resWrapper("Courses Reterived", 200, course))

}

const deleteACourse = async (req, res) => {
    const id = req.params.id;
    if (!isValidUuid(id, res)) return;


    const course = await Course.findByPk(id, {
        ...includeObj
    });
    if (!course) return res.status(404).send(resWrapper("Course Not Found", 404, null, "Id Is Not Valid"))

    await course.destroy();

    return res.status(200).send(resWrapper("Course Deleted", 200, course));
}

const updateACourse = async (req, res) => {
    const id = req.params.id;
    if (!isValidUuid(id, res)) return;


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
    if (value.addImages && value.addImages.length) {

        const courseImages = value.addImages.map(url => ({
            url,
            courseId: course.id,
        }));

        await CourseImage.bulkCreate(courseImages);
    }


    const { addImages, deletedImages, ...filteredObject } = value;;
    if (value.categoryId) {
        if (!isValidUuid(value.categoryId, res)) return;

        const category = await CourseCategory.findByPk(value.categoryId);
        if (!category) return res.status(404).send(resWrapper("Category Dosn't Exist", 404, null, "Category Id Is Not Valid"));

        await course.update({ ...filteredObject })
    } else {
        await course.update({ ...filteredObject });
    }

    const updatedCourse = await Course.findByPk(id, { ...includeObj })
    return res.status(200).send(resWrapper("Course Updated", 200, updatedCourse))

}

const getAllStudentsOfACourse = async (req, res) => {
    const id = req.params.id;
    if (!isValidUuid(id, res)) return;


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