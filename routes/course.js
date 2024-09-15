const express = require("express");
const { uploadImages } = require("../middlewares/multer");
const { createCourse, getAllCourses, getACourse, deleteACourse, updateACourse, getAllStudentsOfACourse } = require("../controllers/course")
const courseRouter = express.Router();


courseRouter.get("/", getAllCourses);
courseRouter.get("/:id", getACourse);

courseRouter.post("/", createCourse);

courseRouter.put("/:id", updateACourse);
courseRouter.delete("/:id", deleteACourse);

// Get All Students Of A Couse
courseRouter.get("/:id/students", getAllStudentsOfACourse);




module.exports = courseRouter;