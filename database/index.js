const { Sequelize } = require("sequelize")


const db = process.env.POSTDB || process.env.LOCALPOSTGRES
const sequelize = new Sequelize(db, {
    logging: false
})

module.exports = sequelize;