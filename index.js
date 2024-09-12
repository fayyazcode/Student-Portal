require("dotenv").config();
require("express-async-errors");

const express = require("express")
const helmet = require("helmet");
const cors = require("cors")

const sequelize = require("./database");

// Required Model To Make the Tables In Orders
require("./models");
require("./association")

const router = require("./routes");


const app = express()

app.use(cors({
    origin: {
        source: "*"
    }
}));

app.use(helmet())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/v1", router)

const main = async function () {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log('Connection has been established successfully.');

        const PORT = process.env.PORT || "8080";
        app.listen(PORT, () => {
            console.log("app is listening of PORT: ", PORT);
        })

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

}

main()


