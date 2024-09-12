const express = require("express");
const attendanceRouter = express.Router();

const { createAttendance, getAllAttendance, getAAttendance, updateAttendance, getAllAttendanceOfACourse, getAllAttendanceOfAStudentWithCourse, getAllAttendanceOfAStudent, getUniqueStudnetInQuater, getNewStudnetInQuater, getAllAttendanceOfAQuater } = require("../controllers/attendance");


attendanceRouter.get("/", getAllAttendance);
attendanceRouter.get("/:id", getAAttendance);

attendanceRouter.post("/", createAttendance);

attendanceRouter.put("/:id", updateAttendance);
attendanceRouter.delete("/:id",);


// get All attendance of A Course
attendanceRouter.get("/course/:courseId", getAllAttendanceOfACourse)

// get All attendance Of A Student With A Course
attendanceRouter.get("/course/:courseId/student/:studentId", getAllAttendanceOfAStudentWithCourse)


// Excel Sheet Routes

// get All attendance of a Student
attendanceRouter.get("/student/:studentId", getAllAttendanceOfAStudent)
// get Unique Students In A Quater
attendanceRouter.get("/unique-students/:quater", getUniqueStudnetInQuater)
// get Students in quater who were not in the previouse quaters(new students)
attendanceRouter.get("/new-students/:quater", getNewStudnetInQuater)
// get All Attendace of a Quater
attendanceRouter.get("/all-students/:quater", getAllAttendanceOfAQuater)



module.exports = attendanceRouter;