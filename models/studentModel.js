const sequelize = require("../database")
const { DataTypes } = require("sequelize")

const Student = sequelize.define("Student", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    middleName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    chartIncome: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    income: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    rollNumber: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    gender: {
        type: DataTypes.ENUM("Male", "Female", "Other"),
        allowNull: false
    },
    class: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dob: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    doj: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    phoneNumber1: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phoneNumber2: {
        type: DataTypes.STRING,
        allowNull: true
    },
    note: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    zip: {
        type: DataTypes.STRING,
        allowNull: false
    }
})


module.exports = Student;
