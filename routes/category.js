const express = require("express");
const { createCategory } = require("../controllers/category");
// const { createCourse, getAllCourses, getACourse } = require("../controllers/course")
const categoryRouter = express.Router();


categoryRouter.get("/",);
categoryRouter.get("/:id");

categoryRouter.post("/", createCategory);

categoryRouter.put("/:id");
categoryRouter.delete("/:id");





module.exports = categoryRouter;