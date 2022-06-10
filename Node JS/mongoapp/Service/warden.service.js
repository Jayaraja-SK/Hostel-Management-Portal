const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require('cors');
const req = require("express/lib/request");
const bcrypt = require("bcryptjs");

const dotenv = require('dotenv').config();

app.use(express.json());


const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});



const MongoClient = require('mongodb').MongoClient;


const uri = <enter_uri>;
const client = new MongoClient(uri, { useNewUrlParser: true });


var ObjectId = require('mongodb').ObjectID;



exports.addAdmin = async function () {
      client.connect((err) => {
        if (err) throw err;

        const database = client.db("hostel");
                    
        const users = database.collection("users");

        users.find({}).toArray(function(err, result) {
            if (err) throw err;

            var i;

            var flag=0;

            for(i=0;i<result.length;i++)
            {
                if(result[i]["email"] === "admin@ssn")
                {
                    flag=1;
                    break;
                }
            }

            if(result === null || flag === 0)
            {
                const password = bcrypt.hashSync("admin", 10);


                  client.connect((err) => {
                    if(err) throw err;
            
                    const database = client.db("hostel");
                    
                    const users = database.collection("users");

                    const tuple = {
                        "email" : "admin@ssn",
                        "name" : "ADMIN",
                        "contact_no" : null,
                        "role" : "WARDEN",
                        "password" : password
                      }
            

                    users.insertOne(tuple, function() {

                        users.find({"email":"admin@ssn"}).toArray(function(err, result) {
                            if (err) throw err;

                            const wardens = database.collection("wardens");

                            const tuple = {
                                user_id: result[0]._id,
                                dob: null,
                                doj: null

                            }
                    

                            wardens.insertOne(tuple, function() {
                                console.log("ADMIN DOES NOT EXIST...\n");
                                console.log("ADMIN HAS BEEN ADDED...\n");
                            });


                        })
                    });
                  });

            }
            
        });
      });
}


exports.addUser = function (data,callback) {
    client.connect((err) => {
        if (err) throw err;

        const database = client.db("hostel");
                    
        const users = database.collection("users");

        users.find({email: data.email}).toArray(function(err, result) {
            if (err) throw err;

            if(result.length === 0)
            {
                const password = bcrypt.hashSync(data.password,10);


                  client.connect((err) => {
                    if(err) throw err;
            
                    const database = client.db("hostel");
                    
                    const users = database.collection("users");

                    const tuple = {
                        "email": data.email,
                        "name": data.name,
                        "contact_no": data.contact_no,
                        "password": password
                    }
            

                    users.insertOne(tuple, function() {
                        return callback(true);
                    });
                  });

            }
            else
            {
                return callback(false);
            }
            
        });
      });

}


exports.editUser = function (data,user_id,callback) {

    client.connect((err) => {
        if (err) throw err;

        const database = client.db("hostel");
                    
        const users = database.collection("users");

        users.find({email: data.email}).toArray(function(err, result) {
            if (err) throw err;

            if(result.length === 0)
            {
                users.updateOne({"_id":ObjectId(`${user_id}`)}, {$set: {"email":data.email,"name": data.name,"contact_no":data.contact_no}}, function(err) {
                    if (err) throw err;
        
                    return callback(true);
                    
                });

            }
            else
            {
                if(user_id === result[0]["_id"].toString())
                {
                    users.updateOne({"_id":ObjectId(`${user_id}`)}, {$set: {"name": data.name,"contact_no":data.contact_no}}, function(err) {
                        if (err) throw err;
            
                        return callback(true);
                        
                    });
                }
                else
                {
                    return callback(false);
                }
            }
            
        });
      });

}


exports.editPassword = function (data,user_id,callback) {

    client.connect((err) => {
        if (err) throw err;

        const database = client.db("hostel");
                    
        const users = database.collection("users");

        const password = bcrypt.hashSync(data.password, 10);

        users.updateOne({"_id":ObjectId(`${user_id}`)}, {$set: {"password":password}}, function(err) {
            if (err) throw err;

            return callback();
            
        });
      });

}





exports.addWarden = function (data,callback) {

    client.connect((err) => {
        if (err) throw err;

        const database = client.db("hostel");
                    
        const users = database.collection("users");

        users.find({email: data.email}).toArray(function(err, result) {
            if (err) throw err;

            client.connect((err) => {
                if(err) throw err;
        
                const database = client.db("hostel");
                
                const wardens = database.collection("wardens");

                const tuple = {
                    user_id: result[0]._id,
                    dob: data.dob,
                    doj: data.doj

                }
        

                wardens.insertOne(tuple, function() {
                    return callback(true);
                });
              });
            
        });
      });

}


exports.editWarden = function (data,warden_id,callback) {

    client.connect((err) => {
        if (err) throw err;

        const database = client.db("hostel");
                    
        const wardens = database.collection("wardens");

        wardens.updateOne({"user_id":ObjectId(`${warden_id}`)}, {$set: {"dob": data.warden_dob,"doj":data.warden_doj}}, function(err) {
            if (err) throw err;

            return callback();
            
        });
      });

}


exports.getWardens = function (callback) {

    client.connect((err) => {
        if (err) throw err;

        const database = client.db("hostel");
                    
        const users = database.collection("users");

        users.find({}).toArray(function(err, result) {
            if (err) throw err;

            client.connect((err) => {
                if(err) throw err;
        
                const database = client.db("hostel");
                
                const wardens = database.collection("wardens");

                wardens.find({}).toArray(function(err, result1) {
                    if(err) throw err;

                    var i,j;

                    for(i=0;i<result.length;i++)
                    {
                        result[i]["user_id"]=result[i]["_id"];

                        for(j=0;j<result1.length;j++)
                        {
                            if(result[i]["_id"].toString() == result1[j]["user_id"].toString())
                            {
                                result[i]["dob"]=result1[j]["dob"];
                                result[i]["doj"]=result1[j]["doj"];
                                
                                break;
                            }
                        }
                    }

                    return callback(result);

                });
                
              });
            
        });
      });

}



exports.deleteUser = function (user_id,callback) {
    
    client.connect((err) => {
        if (err) throw err;

        const database = client.db("hostel");
                    
        const users = database.collection("users");

        users.deleteOne({"_id":ObjectId(`${user_id}`)}, function(err) {
            if (err) throw err;

            client.connect((err) => {
                if(err) throw err;
        
                const database = client.db("hostel");
                
                const wardens = database.collection("wardens");

                wardens.deleteOne({"user_id":ObjectId(`${user_id}`)}, function(err) {
                    if(err) throw err;

                    return callback();

                });
                
              });
            
        });
      });

}

