const { validateCreateAttendance, validateUpdateAttendance, validateUniqueStudentInQuater, validateYear } = require("../joischemas/attendance");
const { resWrapper, getQuarterDates, isValidUuid } = require("../utils");

const Enrollment = require("../models/enrollment");
const Attendance = require("../models/attendance")
const Student = require("../models/studentModel");
const Course = require("../models/courseModel");
const { Op } = require("sequelize");
const CourseImage = require("../models/courseImageModel");
const CourseCategory = require("../models/courseCategoryModel");

const includeObj = {
    include: [
        {
            model: Enrollment, as: "enrollment", include: [
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
        }
    ]
}

const createAttendance = async (req, res) => {
    const { error, value: { enrollmentId, date, isPresent } } = validateCreateAttendance(req.body)
    if (error) return res.status(400).send(resWrapper(error.message, 400, null, error.message));

    if (!isValidUuid(enrollmentId, res)) return;

    const enrollment = await Enrollment.findByPk(enrollmentId);
    if (!enrollment) return res.status(404).send(resWrapper("Enrollment Not Found", 404, null, "Enrollment Id Is Not Valid"));


    const oldAttendace = await Attendance.findOne({
        where: {
            enrollmentId: enrollmentId,
            date: date
        }
    })
    if (oldAttendace) return res.status(400).send(resWrapper("Attendance Is Already Taken", 400, null, "Can't Take Alreay Taken Attendance"))

    const attendance = await Attendance.create({ enrollmentId, date, isPresent });

    const temp = await Attendance.findByPk(attendance.id, {
        ...includeObj
    })

    return res.status(201).send(resWrapper("Attendance created", 201, temp));
}

const getAllAttendance = async (req, res) => {
    const attendance = await Attendance.findAll({ ...includeObj });
    return res.status(200).send(resWrapper("All Enrollments", 200, attendance));
}

const getAAttendance = async (req, res) => {
    const id = req.params.id;

    if (!isValidUuid(id, res)) return;


    const attendance = await Attendance.findByPk(id, {
        ...includeObj
    });
    if (!attendance) return res.status(404).send(resWrapper("Attendance Not Found", 404, null, "Id Is Not Valid"));

    return res.status(200).send(resWrapper("Enrollment Reterived", 200, attendance))
}

const updateAttendance = async (req, res) => {
    const id = req.params.id;

    if (!isValidUuid(id, res)) return;


    const { error, value } = validateUpdateAttendance(req.body);
    if (error) return res.status(400).send(resWrapper(error.message, 400, null, error.message))

    const attendance = await Attendance.findByPk(id, { ...includeObj });
    if (!attendance) return res.status(404).send(resWrapper("Attendance Not Found", 404, null, "Id Is Not Valid"));

    await attendance.update({ ...value });

    return res.status(200).send(resWrapper("Updated", 200, attendance))

}

const getAllAttendanceOfACourse = async (req, res) => {
    const courseId = req.params.courseId;
    if (!isValidUuid(courseId, res)) return;


    const course = await Course.findByPk(courseId);
    if (!course) return res.status(404).send(resWrapper("Course Not Found", 404, null, "Course Id Is Not Valid"));

    const attendance = await Attendance.findAll({
        include: [
            {
                model: Enrollment, as: "enrollment", where: {
                    courseId
                },
                include: [
                    { model: Student, as: "student" },
                    { model: Course, as: "course" }
                ]
            }
        ]
    });

    return res.status(200).send(resWrapper("All Attendances", 200, attendance))
}

const getAllAttendanceOfAStudentWithCourse = async (req, res) => {
    const { startDate, endDate } = req.query;

    let dateQuery = {};
    if (startDate && endDate) {
        dateQuery.where = {
            date: {
                [Op.between]: [startDate, endDate]
            }
        }
    } else if (startDate) {
        dateQuery.where = {
            date: {
                [Op.gte]: startDate
            }
        }
    } else if (endDate) {
        dateQuery.where = {
            date: {
                [Op.lte]: endDate
            }
        }
    } else {
        dateQuery.where = {
            date: {
                [Op.lte]: new Date()
            }
        }
    }
    const courseId = req.params.courseId;
    if (!isValidUuid(courseId, res)) return;

    const studentId = req.params.studentId;
    if (!isValidUuid(studentId, res)) return;


    const course = await Course.findByPk(courseId);
    if (!course) return res.status(404).send(resWrapper("Course Not Found", 404, null, "Course Id Is Not Valid"));

    const student = await Student.findByPk(studentId);
    if (!student) return res.status(404).send(resWrapper("Student Not Found", 404, null, "Student Id Is Not Valid"));

    const attendance = await Attendance.findAll({
        include: [
            {
                model: Enrollment, as: "enrollment", where: {
                    courseId,
                    studentId
                },
                include: [
                    { model: Student, as: "student" },
                    { model: Course, as: "course" }
                ]
            }
        ],
        ...dateQuery
    });

    return res.status(200).send(resWrapper("All Attendances", 200, attendance))
}

const getAllAttendanceOfAStudent = async (req, res) => {
    const studentId = req.params.studentId;
    if (!isValidUuid(studentId, res)) return;



    const student = await Student.findByPk(studentId);
    if (!student) return res.status(404).send(resWrapper("Student Not Found", 404, null, "Student Id Is Not Valid"));

    const attendance = await Attendance.findAll({
        include: [
            {
                model: Enrollment, as: "enrollment", where: {
                    studentId
                },
                include: [
                    { model: Student, as: "student" },
                    { model: Course, as: "course" }
                ]
            }
        ]
    });

    return res.status(200).send(resWrapper("All Attendances", 200, attendance))
}

const getUniqueStudnetInQuater = async (req, res) => {
    const { error, value } = validateUniqueStudentInQuater(req.params)
    if (error) return res.status(200).send(resWrapper(error.message, 400, null, error.message));

    const { startDate, endDate } = getQuarterDates(value.quater)

    const uniqueStudents = await Student.findAndCountAll({
        // attributes: ['id', 'firstName', 'lastName'],
        include: [{
            model: Enrollment,
            // attributes: [],
            as: "enrollments",
            required: true,  // Forces INNER JOIN instead of LEFT OUTER JOIN
            include: [{
                model: Attendance,
                // attributes: [],
                where: {
                    date: {
                        [Op.between]: [startDate, endDate],
                    },
                    isPresent: true,
                },
                required: true,  // Ensures only enrollments with matching attendance are included
            }, { model: Course, as: "course", include: [{ model: CourseCategory, as: "category" }] }],
        }],
        distinct: true,
    });

    return res.status(200).send(resWrapper("Date Received", 200, uniqueStudents));
}

const getNewStudnetInQuater = async (req, res) => {
    const { error, value } = validateUniqueStudentInQuater(req.params)
    if (error) return res.status(200).send(resWrapper(error.message, 400, null, error.message));

    let newStartDate = null;
    let newEndDate = null;

    // Idhr say krna ha start or end laini ha
    const { year } = req.query
    if (year) {
        const { error } = validateYear({ year });
        if (error) return res.status(400).send(resWrapper(error.message, 400, null, error.message))

        const { startDate, endDate } = getQuarterDates(value.quater, year);
        newStartDate = startDate;
        newEndDate = endDate;
        // [startDate, endDate] = result;
    } else {
        const { endDate, startDate } = getQuarterDates(value.quater);
        newStartDate = startDate;
        newEndDate = endDate;
    }

    // let uniqueStudents;
    let date
    if (value.quater === "Q1") {
        date = {
            where: {
                date: {
                    [Op.between]: [newStartDate, newEndDate],
                },
                isPresent: true,
            },
        }

    } else {
        date = {
            [Op.and]: [
                {
                    [Op.between]: [newStartDate, newEndDate] // Date between start and end date
                },
                {
                    [Op.notBetween]: ['2024-01-01', newStartDate] // Date not between January 1, 2024 and start date
                }
            ]
        }
    }

    newStudents = await Student.findAndCountAll({
        // attributes: ['id', 'firstName', 'lastName'],
        include: [{
            model: Enrollment,
            // attributes: [],
            as: "enrollments",
            required: true,  // Forces INNER JOIN instead of LEFT OUTER JOIN
            include: [{
                model: Attendance,
                // attributes: [],
                where: {
                    date: date,
                    isPresent: true,
                },
                required: true,  // Ensures only enrollments with matching attendance are included
            }, { model: Course, as: "course", include: [{ model: CourseCategory, as: "category" }] }],
        }],
        distinct: true,
    });

    return res.status(200).send(resWrapper("Date Received", 200, newStudents));

}

const getAllAttendanceOfAQuater = async (req, res) => {
    const { error, value } = validateUniqueStudentInQuater(req.params)
    if (error) return res.status(200).send(resWrapper(error.message, 400, null, error.message));

    const { startDate, endDate } = getQuarterDates(value.quater)

    const attendaces = await Attendance.findAndCountAll({
        where: {
            date: {
                [Op.between]: [startDate, endDate],
            },
            isPresent: true
        },
        ...includeObj
    });

    return res.status(200).send(resWrapper("All Attendance Reterived", 200, attendaces))
}

// const deleteAEnrollment = async (req, res) => {
//     const id = req.params.id;

//     const enrollment = await Enrollment.findByPk(id, {
//         ...includeObj
//     });
//     if (!enrollment) return res.status(404).send(resWrapper("Enrollment Not Found", 404, null, "Id Is Not Valid"));

//     await enrollment.destroy();

//     return res.status(200).send(resWrapper("Enrollment Deleted", 200, enrollment));
// }

module.exports = { createAttendance, getAllAttendance, getAAttendance, updateAttendance, getAllAttendanceOfACourse, getAllAttendanceOfAStudentWithCourse, getAllAttendanceOfAStudent, getUniqueStudnetInQuater, getNewStudnetInQuater, getAllAttendanceOfAQuater }