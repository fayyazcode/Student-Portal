const sequelize = require("../database")
const { DataTypes } = require("sequelize")

const CourseCategory = sequelize.define("CourseCategory", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
});


module.exports = CourseCategory