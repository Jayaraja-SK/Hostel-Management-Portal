const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require('cors');
const req = require("express/lib/request");
const auth=require('../middleware/auth');

var router = express.Router();

var wardenController = require("../Controller/warden.controller");


router.post("/user/warden",cors(),wardenController.addWarden);



// EDIT USER

router.put("/user/:user_id",cors(),wardenController.editUser);

router.put("/user/warden/:warden_id",cors(),wardenController.editWarden);

router.put("/user/pwd/:user_id",cors(),wardenController.editPassword);



// DELETE USER

router.delete("/user/:user_id",cors(),wardenController.deleteUser);



// GET DETAILS

router.get("/wardens",cors(),wardenController.getWardens);

router.post("/validate",cors(),function (request,response) { response.send(""); });


module.exports = router;