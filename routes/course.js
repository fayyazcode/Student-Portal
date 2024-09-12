const express = require("express");
const { uploadImages } = require("../middlewares/multer");
const { createCourse, getAllCourses, getACourse, deleteACourse, updateACourse, getAllStudentsOfACourse } = require("../controllers/course")
const courseRouter = express.Router();


courseRouter.get("/", getAllCourses);
courseRouter.get("/:id", getACourse);

courseRouter.post("/", uploadImages({ fieldName: "images", maxCount: 10, }), createCourse);

courseRouter.put("/:id", uploadImages({ fieldName: "images", isRequired: false, maxCount: 10 }), updateACourse);
courseRouter.delete("/:id", deleteACourse);

// Get All Students Of A Couse
courseRouter.get("/:id/students", getAllStudentsOfACourse);




module.exports = courseRouter;