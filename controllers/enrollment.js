const Enrollment = require("../models/enrollment");
const Student = require("../models/studentModel");
const { resWrapper } = require("../utils");

const { validateCreateEnrollment } = require("../joischemas/enrollment");
const Course = require("../models/courseModel");
const CourseImage = require("../models/courseImageModel");

const includeObj = {
    include: [
        { model: Student, as: "student" },
        {
            model: Course, as: "course", include: [{
                model: CourseImage, as: "images", attributes: {
                    exclude: ["courseId"]
                }
            }]
        }
    ]
}

const createEnrollment = async (req, res) => {
    const { error, value: { studentId, courseId } } = validateCreateEnrollment(req.body)
    if (error) return res.status(400).send(resWrapper(error.message, 400, null, error.message));

    const student = await Student.findByPk(studentId);
    if (!student) return res.status(404).send(resWrapper("Student Not Found", 404, null, "Student Id Is Not Valid"));

    const course = await Course.findByPk(courseId);
    if (!course) return res.status(404).send(resWrapper("Course Not Found", 404, null, "Course Id Is Not Valid"));

    const oldEnrollment = await Enrollment.findOne({
        where: {
            studentId,
            courseId
        }
    })
    if (oldEnrollment) return res.status(400).send(resWrapper("Student Is Already Enrolled", 400, null, "Student Is Already Enrolled"))

    const enrollment = await Enrollment.create({ studentId, courseId });

    const temp = await Enrollment.findByPk(enrollment.id, {
        ...includeObj
    })
    return res.status(201).send(resWrapper("Enrollment created", 201, temp));
}

const getAllEnrollments = async (req, res) => {
    const enrollments = await Enrollment.findAll({ ...includeObj });
    return res.status(200).send(resWrapper("All Enrollments", 200, enrollments));
}

const getAEnrollment = async (req, res) => {
    const id = req.params.id;

    const enrollment = await Enrollment.findByPk(id, {
        ...includeObj
    });
    if (!enrollment) return res.status(404).send(resWrapper("Enrollment Not Found", 404, null, "Id Is Not Valid"));

    return res.status(200).send(resWrapper("Enrollment Reterived", 200, enrollment))
}

const deleteAEnrollment = async (req, res) => {
    const id = req.params.id;

    const enrollment = await Enrollment.findByPk(id, {
        ...includeObj
    });
    if (!enrollment) return res.status(404).send(resWrapper("Enrollment Not Found", 404, null, "Id Is Not Valid"));

    await enrollment.destroy();

    return res.status(200).send(resWrapper("Enrollment Deleted", 200, enrollment));
}

module.exports = { createEnrollment, getAllEnrollments, getAEnrollment, deleteAEnrollment }