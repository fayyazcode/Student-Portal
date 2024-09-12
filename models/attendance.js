const { DataTypes } = require("sequelize")
const sequelize = require("../database");
const Enrollment = require("./enrollment");

const Attendance = sequelize.define("Attendance", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    enrollmentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Enrollment,
            key: "id"
        },
        onDelete: "CASCADE",
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    isPresent: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
});


module.exports = Attendance

