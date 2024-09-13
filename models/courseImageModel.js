const sequelize = require("../database");
const { DataTypes } = require("sequelize");
const Course = require("./courseModel");

const CourseImage = sequelize.define("CourseImage", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
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
}, {
    timestamps: false
})


module.exports = CourseImage