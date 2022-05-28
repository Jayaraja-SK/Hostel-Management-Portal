const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require('cors');
const req = require("express/lib/request");
const auth=require('./middleware/auth');



var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

app.use(express.json());



var wardenController = require("./Controller/warden.controller");

var loginController = require("./Controller/login.controller");

wardenController.addAdmin();



var student = require("./Routes/student.routes");

var warden = require("./Routes/warden.routes");

var sub_warden = require("./Routes/subwarden.routes");

var mess = require("./Routes/mess.routes");



app.get("/",function(request,response){
    response.send("Hello World!")
});




//app.use("/warden",auth,warden);

//app.use("/student",auth,student);

//app.use("/mess",auth,mess);


app.use("/warden",warden);

app.use("/sub_warden",sub_warden);

app.use("/student",student);

app.use("/mess",mess);




app.post("/login",cors(),loginController.validateUser);


app.listen(8080, function () {
    console.log("APPLICATION STARTED ON PORT %d\n",8080)
});