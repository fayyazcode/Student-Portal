const Attendance = require("../models/attendance");
const CourseCategory = require("../models/courseCategoryModel");
const CourseImage = require("../models/courseImageModel");
const Course = require("../models/courseModel");
const Enrollment = require("../models/enrollment");
const Student = require("../models/studentModel");

// // Course with CourseImage 1->M 1<-M

Course.hasMany(CourseImage, { foreignKey: "courseId", as: "images" });
CourseImage.belongsTo(Course, { foreignKey: "courseId" })

// Course with Category 1-> 1   1<-M

Course.belongsTo(CourseCategory, { foreignKey: "categoryId", as: "category" });
CourseCategory.hasMany(Course, { foreignKey: "categoryId" });



// Student has many courses through enrollment
Student.belongsToMany(Course, { through: Enrollment, foreignKey: "studentId" });
// Course has many students through enrollment
Course.belongsToMany(Student, { through: Enrollment, foreignKey: "courseId" });


// Enrollment With Student And Course
Enrollment.belongsTo(Student, { foreignKey: 'studentId', as: "student" });
Enrollment.belongsTo(Course, { foreignKey: 'courseId', as: "course" });

// Student and Course Reverse with Enrollment
Student.hasMany(Enrollment, { foreignKey: "studentId", as: "enrollments" });
Course.hasMany(Enrollment, { foreignKey: "courseId", as: "enrollments" });

// Student and Course Through Enrollment
// Student.belongsToMany(Course, { through: Enrollment, foreignKey: "studentId", as: "courses" });
// Course.belongsToMany(Student, { through: Enrollment, foreignKey: "courseId", as: "students" });



// Attendance With Student 1->M 1<-M
Attendance.belongsTo(Enrollment, { foreignKey: "enrollmentId", as: "enrollment" });
Enrollment.hasMany(Attendance, { foreignKey: "enrollmentId" });



