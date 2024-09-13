const sequelize = require("../database")
const { DataTypes } = require("sequelize")

const CourseCategory = sequelize.define("CourseCategory", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
});


module.exports = CourseCategory