const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require('cors');
const req = require("express/lib/request");

var router = express.Router();

var studentController = require("../Controller/student.controller");


router.post("/leave_form",cors(),studentController.addLeaveForm);

router.get("/leave_forms/:student_id",cors(),studentController.getLeaveForms);

router.get("/personal_details",cors(),studentController.getStudentDetails);

router.post("/complaint_reg",cors(),studentController.addComplaintReg);

router.get("/complaints/:student_id",cors(),studentController.getComplaints);

router.put("/complaint/complaint_id=:complaint_id&&status=:status",cors(),studentController.changeComplaintStatus);

router.post("/bill_cancellation",cors(),studentController.addBillCancellation);

router.put("/change_pwd/:student_id",cors(),studentController.changePassword);

router.post("/validate",cors(),function (request,response) { response.send(""); });

module.exports = router;