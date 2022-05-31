const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require('cors');
const req = require("express/lib/request");
const bcrypt = require("bcryptjs");

app.use(express.json());


const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


exports.getBillCancellations = function (mess_id, from_date, to_date, callback) {
    var dml = `select 
        mess_bill_cancellation.student_id, users.name, users.contact_no, campus.campus_name, courses.course_name, students.batch, students.room_no, mess_bill_cancellation.request_date, mess_bill_cancellation.from_date, mess_bill_cancellation.to_date
    from 
        mess_bill_cancellation, mess, students, mess_students, users, campus, courses
    where
        mess_bill_cancellation.student_id=students.student_id
        and
        mess_students.campus_id=students.campus_id
        and
        mess_students.batch=students.batch
        and
        mess_students.mess_id=mess.mess_id
        and
        users.user_id=students.student_id
        and 
        students.campus_id=campus.campus_id
        and
        students.course_id=courses.course_id
        and
        mess.mess_id=${mess_id}
        and
        mess_bill_cancellation.request_date>='${from_date}'
        and
        mess_bill_cancellation.request_date<='${to_date}'
    order by
        mess_bill_cancellation.request_date DESC`;

    connection.query(dml,function(err,result,field) {
        if(err) throw err;
        
        return callback(result);
    });

}


exports.getBillCancellationsOfStudent = function (mess_id, student_id, callback) {
    var dml = `select 
        mess_bill_cancellation.student_id, users.name, users.contact_no, campus.campus_name, courses.course_name, students.batch, students.room_no, mess_bill_cancellation.request_date, mess_bill_cancellation.from_date, mess_bill_cancellation.to_date
    from 
        mess_bill_cancellation, mess, students, mess_students, users, campus, courses
    where
        mess_bill_cancellation.student_id=students.student_id
        and
        mess_students.campus_id=students.campus_id
        and
        mess_students.batch=students.batch
        and
        mess_students.mess_id=mess.mess_id
        and
        users.user_id=students.student_id
        and 
        students.campus_id=campus.campus_id
        and
        students.course_id=courses.course_id
        and
        mess.mess_id=${mess_id}
        and
        students.student_id=${student_id}
    order by
        mess_bill_cancellation.request_date DESC`;

    connection.query(dml,function(err,result,field) {
        if(err) throw err;
        
        return callback(result);
    });

}


exports.getStudentsList = function (mess_id, campus_id, course_id, batch, callback) {
    var dml = `select 
        students.student_id, users.name, users.contact_no, campus.campus_name, courses.course_name, students.batch, students.room_no 
    from 
        mess, students, mess_students, users, campus, courses
    where
        mess_students.campus_id=students.campus_id
        and
        mess_students.batch=students.batch
        and
        mess_students.mess_id=mess.mess_id
        and
        users.user_id=students.student_id
        and 
        students.campus_id=campus.campus_id
        and
        students.course_id=courses.course_id
        and
        mess.mess_id=${mess_id}
        and
        campus.campus_id=${campus_id}
        and
        courses.course_id=${course_id}
        and
        students.batch=${batch}`;

    connection.query(dml,function(err,result,field) {
        if(err) throw err;
        
        return callback(result);
    });

}



exports.getCampus = function (mess_id, callback) {
    var dml = `select 
    campus.campus_id,campus.campus_name,campus.campus_loc
    from campus,mess_students
    where
    mess_students.campus_id=campus.campus_id
    and
    mess_students.mess_id=${mess_id}`;

    connection.query(dml,function(err,result,field) {
        if(err) throw err;

        return callback(result);
    });

}


exports.getCoursesByCampus = function (campus_id, callback) {
    var dml = `select * from courses where campus_id=${campus_id}`;

    connection.query(dml,function(err,result,field) {
        if(err) throw err;

        return callback(result);
    });

}


exports.changePassword = function (user_id,data,callback) {
    var dml = `select password from users where user_id=${user_id}`;

    connection.query(dml,function(err,result) {
        if(err) throw err;

        if(bcrypt.compareSync(data.password,result[0].password))
        {
            const password = bcrypt.hashSync(data.new_password,10);

            dml = `update users set password='${password}' where user_id=${user_id}`;

            connection.query(dml,function(err,result) {
                if(err) throw err;

                return callback(true);
            });
        }
        else
        {
            return callback(false);
        }
    });

}