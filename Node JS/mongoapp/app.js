const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require('cors');
const req = require("express/lib/request");
const auth=require('./middleware/auth');


const MongoClient = require('mongodb').MongoClient;


const uri = 'mongodb+srv://hosteluser:hostel@cluster0.xeeco.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true });


var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

app.use(express.json());



var wardenController = require("./Controller/warden.controller");

var loginController = require("./Controller/login.controller");

wardenController.addAdmin();



var warden = require("./Routes/warden.routes");





app.get("/",function(request,response){
    response.send("Hello World!")
});




app.use("/warden",auth,warden);




app.post("/login",cors(),loginController.validateUser);


app.listen(8080, function () {
    /*client.connect((err) => {
        if(err) throw err;

        console.log("HELLO");
        const database = client.db("hostel");
        
        const users = database.collection("users");

        const doc = {
            title: "Record of a Shriveled Datum",
            content: "No bytes, no problem. Just insert a document, in MongoDB",
          }
        const result = users.insertOne(doc, function() {
            console.log("INSERTED");
        });
      });*/
    console.log("APPLICATION STARTED ON PORT %d\n",8080)
});


/*app.get("/file/:request_id", function (request, response) {
    //createInvoice({},'./Leave_Requests/'+request.params.request_id+'.pdf')
    response.sendFile(__dirname+'/Leave_Requests/'+request.params.request_id+'.pdf')
}
);*/


