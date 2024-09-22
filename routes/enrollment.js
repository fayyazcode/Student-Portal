const express = require("express");
const { createEnrollment, getAllEnrollments, getAEnrollment, deleteAEnrollment, getAEnrollmentsOfAStudentOfCourse } = require("../controllers/enrollment");
const enrollmentRouter = express.Router();

// get A enrollment of a student
enrollmentRouter.get("/:studentId/:courseId", getAEnrollmentsOfAStudentOfCourse);

enrollmentRouter.get("/", getAllEnrollments);
enrollmentRouter.get("/:id", getAEnrollment);



enrollmentRouter.post("/", createEnrollment);

enrollmentRouter.put("/:id");
enrollmentRouter.delete("/:id", deleteAEnrollment);






module.exports = enrollmentRouter;