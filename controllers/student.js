const { resWrapper } = require("../utils");
const Student = require("../models/studentModel");
const { validateCreateStudent } = require("../joischemas/student");
const { Op } = require("sequelize");

const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    // adjust age based on month and day of birthdate
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
};

const createStudent = async (req, res) => {
    const { error, value } = validateCreateStudent(req.body)
    if (error) return res.status(400).send(resWrapper(error.message, 400, null, error.message));

    const prevStudent = await Student.findOne({
        where: {
            email: value.email
        }
    })
    if (prevStudent) return res.status(400).send(resWrapper("Student With Email Already Exist", 400, null, "Email Is Not Valid"))

    const age = calculateAge(value.dob);

    const student = await Student.create({ ...value, age: age });
    return res.status(201).send(resWrapper("Enrollment created", 201, student));
}

const getAllStudents = async (req, res) => {
    let students;
    const query = req.query;
    if (Object.keys(query).length === 0) {
        const where = {};
        const attributes = Object.keys(Student.getAttributes())

        Object.keys(query).forEach((key) => {
            if (attributes.includes(key)) {
                where[key] = {
                    [Op.like]: `%${query[key]}%`
                };
            }
        });
        students = await Student.findAll({ where });
    } else {
        students = await Student.findAll()
    }


    return res.status(200).send(resWrapper("All Students", 200, students));
}

const getAStudent = async (req, res) => {
    const id = req.params.id;

    const student = await Student.findOne({ where: { id } });
    if (!student) return res.status(404).send(resWrapper("Student Not Found", 404, null, "Id Is Not Valid"));

    return res.status(200).send(resWrapper("Student Reterived", 200, student));
}

const deleteAStudent = async (req, res) => {
    const id = req.params.id;
    const student = await Student.findOne({ where: { id } });
    if (!student) return res.status(404).send(resWrapper("Student Not Found", 404, null, "Id Is Not Valid"));

    await student.destroy();

    return res.status(200).send(resWrapper("Student Deleted", 200, student));
}


module.exports = { createStudent, getAllStudents, getAStudent, deleteAStudent }