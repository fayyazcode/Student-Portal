const sequelize = require("../database")
const { DataTypes } = require("sequelize");
const CourseCategory = require("./courseCategoryModel");

const Course = sequelize.define('Course', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Published', 'Draft', 'Inactive'),
        allowNull: true,
        defaultValue: 'Published',
    },
    categoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: CourseCategory,
            key: 'id'
        },
        onDelete: "CASCADE"
    }
});


module.exports = Course