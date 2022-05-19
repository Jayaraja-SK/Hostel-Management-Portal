const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require('cors');
const req = require("express/lib/request");

var router = express.Router();

var studentController = require("../Controller/student.controller");


router.post("/leave_form",cors(),studentController.addLeaveForm);


module.exports = router;