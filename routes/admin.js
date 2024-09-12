const express = require("express");
const { uploadImages } = require("../middlewares/multer");
const { createAdmin, login } = require("../controllers/admin");
// const { createCourse, getAllCourses, getACourse } = require("../controllers/course")
const adminRouter = express.Router();


adminRouter.get("/",);
adminRouter.get("/:id",);

adminRouter.post("/login", login)
adminRouter.post("/", uploadImages({ fieldName: "image", isSinlge: true }), createAdmin);

adminRouter.put("/:id");
adminRouter.delete("/:id");





module.exports = adminRouter;