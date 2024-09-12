const express = require("express");
const { createEnrollment, getAllEnrollments, getAEnrollment, deleteAEnrollment } = require("../controllers/enrollment");
const enrollmentRouter = express.Router();


enrollmentRouter.get("/", getAllEnrollments);
enrollmentRouter.get("/:id", getAEnrollment);

enrollmentRouter.post("/", createEnrollment);

enrollmentRouter.put("/:id");
enrollmentRouter.delete("/:id", deleteAEnrollment);





module.exports = enrollmentRouter;