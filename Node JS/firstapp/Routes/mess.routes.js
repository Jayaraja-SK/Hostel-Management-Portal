const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require('cors');
const req = require("express/lib/request");

var router = express.Router();

var messController = require("../Controller/mess.controller");

router.get("/bill_cancellations/:mess_id/from_date=:from_date&&to_date=:to_date",cors(),messController.getBillCancellations);

router.get("/bill_cancellations_student/:mess_id/:student_id",cors(),messController.getBillCancellationsOfStudent);

router.get("/students_list/:mess_id/campus_id=:campus_id&&course_id=:course_id&&batch=:batch",cors(),messController.getStudentsList);


router.get("/campus/:mess_id",cors(),messController.getCampus);

router.get("/campus/:campus_id/courses",cors(),messController.getCoursesByCampus);

router.put("/change_pwd/:mess_id",cors(),messController.changePassword);

router.post("/validate",cors(),function (request,response) { response.send(""); });

module.exports = router;