const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require('cors');
const req = require("express/lib/request");
const auth=require('../middleware/auth');

var router = express.Router();

var wardenController = require("../Controller/warden.controller");


router.post("/user/student",cors(),wardenController.addStudent);

router.post("/user/warden",cors(),wardenController.addWarden);

router.post("/user/mess",cors(),wardenController.addMess);


// EDIT USER

router.put("/user/:user_id",cors(),wardenController.editUser);

router.put("/user/pwd/:user_id",cors(),wardenController.editPassword);

router.put("/user/student/:student_id",cors(),wardenController.editStudent);

router.put("/user/warden/:warden_id",cors(),wardenController.editWarden);

router.put("/user/mess/:mess_id",cors(),wardenController.editMess);


// DELETE USER

router.delete("/user/:user_id",cors(),wardenController.deleteUser);



// ADD, EDIT, DELETE CAMPUS


router.post("/campus",cors(),wardenController.addCampus);

router.put("/campus/:campus_id",cors(),wardenController.editCampus);

router.delete("/campus/:campus_id",cors(),wardenController.deleteCampus);



// ADD, EDIT, DELETE COURSES

router.post("/campus/:campus_id/course",cors(),wardenController.addCourse);

router.put("/campus/:campus_id/course/:course_id",cors(),wardenController.editCourse);

router.delete("/campus/:campus_id/course/:course_id",cors(),wardenController.deleteCourse);


// WARDEN STUDENTS RELATIONSHIP

router.post("/warden_student",cors(),wardenController.addWardenStudentRel);

router.delete("/warden_student/warden_id=:warden_id&&campus_id=:campus_id&&batch=:batch",cors(),wardenController.deleteWardenStudentRel);



// MESS STUDENTS RELATIONSHIP

router.post("/mess_student",cors(),wardenController.addMessStudentRel);

router.delete("/mess_student/mess_id=:mess_id&&campus_id=:campus_id&&batch=:batch",cors(),wardenController.deleteMessStudentRel);



// GET DETAILS

router.get("/wardens",cors(),wardenController.getWardens);

router.get("/mess",cors(),wardenController.getMessDetails);

router.get("/students/campus_id=:campus_id&&course_id=:course_id&&batch=:batch",cors(),wardenController.getStudents);

router.delete("/students/campus_id=:campus_id&&course_id=:course_id&&batch=:batch",cors(),wardenController.deleteStudents);

router.delete("/students/campus_id=:campus_id&&batch=:batch",cors(),wardenController.deleteStudentsByCampusBatch);

router.get("/batches/campus_id=:campus_id&&course_id=:course_id",cors(),wardenController.getBatches);

router.get("/students/email=:email",cors(),wardenController.getStudentInfoByEmail);

router.get("/campus",cors(),wardenController.getAllCampus);

router.get("/campus/:campus_id/courses",cors(),wardenController.getCoursesByCampus);

router.get("/leave_forms/:warden_id",cors(),wardenController.getLeaveForms);

router.get("/leave_forms/:warden_id/status=:status&&from_date=:from_date&&to_date=:to_date",cors(),wardenController.getLeaveFormsByDateStatus);

router.get("/leave_forms/:warden_id/student_id=:student_id",cors(),wardenController.getLeaveFormsByStudentId);

router.put("/leave_forms/:warden_id/request_id=:request_id&&status=:status",cors(),wardenController.changeLeaveFormStatus);

router.get("/warden_student_rel",cors(),wardenController.getWardenStudentRel);

router.get("/mess_student_rel",cors(),wardenController.getMessStudentRel);

router.get("/complaints/:warden_id/complaint_type=:complaint_type&&status=:status&&from_date=:from_date&&to_date=:to_date",cors(),wardenController.getAllComplaints);

router.post("/validate",cors(),function (request,response) { response.send(""); });


module.exports = router;