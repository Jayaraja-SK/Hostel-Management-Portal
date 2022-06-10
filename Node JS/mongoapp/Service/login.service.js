const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require('cors');
const req = require("express/lib/request");
const bcrypt = require("bcryptjs");
const User = require('../Model/user.model');
const _ = require('lodash');
const jwt = require('jsonwebtoken');

const dotenv = require('dotenv').config();

app.use(express.json());


const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});



const MongoClient = require('mongodb').MongoClient;

const uri = 'mongodb+srv://hosteluser:hostel@cluster0.xeeco.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true });



exports.validateUser = function (data,callback) {
    client.connect((err) => {
        if (err) throw err;

        const database = client.db("hostel");
                    
        const users = database.collection("users");

        var query = {"email" : data.email};

        users.find(query).toArray(function(err, result) {
            if (err) throw err;

            if(result.length==0)
        {
            return callback({bool:false,message:"INVALID EMAIL"});

        }
        else
        {
            if(bcrypt.compareSync(data.password,result[0].password))
            {
                data.role = result[0].role;
                data.user_id = result[0]._id;
                
                const user = new User(_.pick(data, ['email', 'password', 'role', 'user_id']));

                const token = jwt.sign({ _id: user._id, user_id: user.user_id, role: user.role }, "secretkey", { expiresIn: "1h"});

                return callback({bool:true,role:data.role,user_id:data.user_id,token:token});
            }

            return callback({bool:false,message:"INVALID PASSWORD"});
        }
            
        });

    });

}