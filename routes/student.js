const express = require("express");
const studnetRouter = express.Router();
// const { createEnrollment } = require("../controllers/enrollment");
const { createStudent, getAllStudents, getAStudent, deleteAStudent } = require("../controllers/student")


studnetRouter.get("/", getAllStudents);
studnetRouter.get("/:id", getAStudent);

studnetRouter.post("/", createStudent);

studnetRouter.put("/:id");
studnetRouter.delete("/:id", deleteAStudent);





module.exports = studnetRouter;