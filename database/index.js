const { Sequelize } = require("sequelize")


const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER

console.log(dbName, dbUser, dbPassword)
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: 'localhost',
    dialect: "mysql",
    logging: false,
});



module.exports = sequelize;