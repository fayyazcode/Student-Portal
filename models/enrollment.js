const { DataTypes } = require("sequelize")
const sequelize = require("../database")
const Student = require("./studentModel")
const Course = require("./courseModel")

const Enrollment = sequelize.define("Enrollment", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    studentId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Student,
            key: "id"
        },
        onDelete: "CASCADE",
    },
    courseId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Course,
            key: "id"
        },
        onDelete: "CASCADE"
    }
});


module.exports = Enrollment

