const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require('cors');
const req = require("express/lib/request");
const auth=require('../middleware/auth');

var router = express.Router();

var wardenController = require("../Controller/warden.controller");



// GET DETAILS


router.get("/leave_forms/:warden_id",cors(),wardenController.getLeaveForms);

router.get("/leave_forms/:warden_id/status=:status&&from_date=:from_date&&to_date=:to_date",cors(),wardenController.getLeaveFormsByDateStatus);

router.get("/leave_forms/:warden_id/student_id=:student_id",cors(),wardenController.getLeaveFormsByStudentId);

router.put("/leave_forms/:warden_id/request_id=:request_id&&status=:status",cors(),wardenController.changeLeaveFormStatus);

router.get("/complaints/:warden_id/complaint_type=:complaint_type&&status=:status&&from_date=:from_date&&to_date=:to_date",cors(),wardenController.getAllComplaints);

router.put("/change_pwd/:sub_warden_id",cors(),wardenController.changePassword);

router.post("/validate",cors(),function (request,response) { response.send(""); });


module.exports = router;