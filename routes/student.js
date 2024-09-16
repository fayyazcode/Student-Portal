const express = require("express");
const studnetRouter = express.Router();
// const { createEnrollment } = require("../controllers/enrollment");
const { createStudent, getAllStudents, getAStudent, deleteAStudent, getAllCoursesOfAStudent, updateAStudent } = require("../controllers/student")


studnetRouter.get("/", getAllStudents);
studnetRouter.get("/:id", getAStudent);

studnetRouter.post("/", createStudent);

studnetRouter.put("/:id", updateAStudent);
studnetRouter.delete("/:id", deleteAStudent);


studnetRouter.get("/:id/courses", getAllCoursesOfAStudent)




module.exports = studnetRouter;