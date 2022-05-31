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


exports.addAdmin = async function () {

    connection.connect((err) => {
        if(err) throw err;

        var dml = "select email from users where email = 'admin@ssn'";
    
        connection.query(dml,function(err,result,field) {
            if(err) throw err;
            
            if(result.length==0)
            {
                console.log("ADMIN DOES NOT EXIST...\n");

                const password = bcrypt.hashSync("admin", 10);
    
                dml = `insert into users(email,name,role,password) values('admin@ssn','ADMIN','WARDEN','${password}')`;
    
                connection.query(dml,function(err,result,field) {
                    if(err) throw err; 
    
                    console.log("ADMIN HAS BEEN ADDED...\n");

                });

                dml = "insert into wardens(warden_id) values(1)";
    
                connection.query(dml,function(err,result,field) {
                    if(err) throw err; 

                });
            }
            
        });

        
    })

}


exports.addUser = function (data,callback) {
    var dml = `select email from users where email = '${data.email}'`

    const password = bcrypt.hashSync(data.password,10);

    connection.query(dml,function(err,result,field) {
        if(err) throw err;

        if(result.length==0)
        {
            dml=`insert into users(email,name,contact_no,role,password) values('${data.email}','${data.name}','${data.contact_no}','${data.role}','${password}')`;

            connection.query(dml,function(err,result) {
                if(err) throw err;
            });

            return callback(true);

        }
        else
        {
            return callback(false);
        }

        
    });

}


exports.editUser = function (data,user_id,callback) {
    var dml = `select email from users where email = '${data.email}'`

    connection.query(dml,function(err,result,field) {
        if(err) throw err;

        if(result.length==0)
        {
            dml=`update users
            set email='${data.email}', name='${data.name}', contact_no=${data.contact_no}
            where user_id=${user_id}`;

            connection.query(dml,function(err,result) {
                if(err) throw err;

                
            });

            return callback(true);

        }

        dml = `select email from users where user_id = '${user_id}'`;

        connection.query(dml,function(err,result,field) {
            if(err) throw err;

            if(result[0].email==data.email)
            {
                dml=`update users
                set email='${data.email}', name='${data.name}', contact_no=${data.contact_no}
                where user_id=${user_id}`;

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
    });

}


exports.editPassword = function (data,user_id,callback) {
    const password = bcrypt.hashSync(data.password, 10);
    
    var dml = `update users
    set password='${password}'
    where user_id=${user_id}`;

    connection.query(dml,function(err,result) {
        if(err) throw err;

        return callback();
    });

}


exports.addStudent = function (data,callback) {
    var dml = `select user_id from users where email = '${data.email}'`

    connection.query(dml,function(err,result,field) {
        if(err) throw err;

        var user_id = result[0].user_id;

        dml = `insert into students(student_id,dob,gender,campus_id,course_id,batch,room_no) values(${user_id},'${data.dob}','${data.gender}',${data.campus_id},${data.course_id},${data.batch},'${data.room_no}')`;


        connection.query(dml,function(err,result) {
            if(err) throw err;

        });
    
    });

}


exports.editStudent = function (data,student_id,callback) {
    var dml = `update students
    set dob='${data.dob}', gender='${data.gender}', campus_id=${data.campus_id}, course_id=${data.course_id}, batch=${data.batch}, room_no='${data.room_no}'
    where student_id=${student_id}`;

    connection.query(dml,function(err,result) {
        if(err) throw err;

        return callback();
    });

}




exports.getStudents = function (campus_id, course_id, batch, callback) {
    var dml = `select 
    users.user_id, users.name, users.email, users.contact_no, students.dob, students.gender, students.room_no, students.campus_id, students.course_id, students.batch
    from users,students
    where users.user_id=students.student_id
    and
    students.campus_id=${campus_id}
    and
    students.course_id=${course_id}
    and
    students.batch=${batch}`;

    connection.query(dml,function(err,result,field) {
        if(err) throw err;

        return callback(result);
    });

}


exports.getBatches = function (campus_id, course_id, callback) {
    var dml = `select 
    distinct(batch)
    from students
    where 
    students.campus_id=${campus_id}
    and
    students.course_id=${course_id}`;

    connection.query(dml,function(err,result,field) {
        if(err) throw err;

        return callback(result);
    });

}


exports.deleteStudentsByCampusBatch = function (campus_id, batch, callback) {
    var dml = `delete
    from users where
    users.user_id in (select 
    students.student_id
    from students
    where 
    students.campus_id=${campus_id}
    and
    students.batch=${batch})`;

    connection.query(dml,function(err,result,field) {
        if(err) throw err;

        return callback();
    });

}


exports.deleteStudents = function (campus_id, course_id, batch, callback) {
    var dml = `delete
    from users where
    users.user_id in (select 
    students.student_id
    from students
    where 
    students.campus_id=${campus_id}
    and
    students.course_id=${course_id}
    and
    students.batch=${batch})`;

    connection.query(dml,function(err,result,field) {
        if(err) throw err;

        return callback();
    });

}

exports.deleteStudentsByCampus = function (campus_id, course_id, batch, callback) {
    var dml = `delete
    from users where
    users.user_id in (select 
    students.student_id
    from students
    where 
    students.campus_id=${campus_id}
    and
    students.course_id=${course_id}
    and
    students.batch=${batch})`;

    connection.query(dml,function(err,result,field) {
        if(err) throw err;

        return callback();
    });

}


exports.getStudentInfoByEmail = function (email, callback) {
    var dml = `select 
    users.user_id, users.name, users.email, users.contact_no, students.dob, students.gender, campus.campus_name, courses.course_name, students.room_no
    from users,students,campus,courses
    where users.user_id=students.student_id
    and
    users.email='${email}'
    and
    campus.campus_id=students.campus_id
    and
    courses.course_id=students.course_id`;

    connection.query(dml,function(err,result,field) {
        if(err) throw err;

        return callback(result);
    });

}


exports.addWarden = function (data,callback) {
    var dml = `select user_id from users where email = '${data.email}'`

    connection.query(dml,function(err,result,field) {
        if(err) throw err;

        var user_id = result[0].user_id;

        dml=`insert into wardens values(${user_id},'${data.dob}','${data.doj}')`;

        connection.query(dml,function(err,result) {
            if(err) throw err;

        });
    
    });

}


exports.editWarden = function (data,warden_id,callback) {
    var dml = `update wardens
    set dob='${data.warden_dob}', doj='${data.warden_doj}'
    where warden_id=${warden_id}`;

    connection.query(dml,function(err,result) {
        if(err) throw err;

        return callback();
    });

}


exports.getWardens = function (callback) {
    var dml = `select 
    users.user_id, users.name, users.email, users.contact_no, wardens.dob, wardens.doj
    from users,wardens
    where users.user_id=wardens.warden_id`;

    connection.query(dml,function(err,result,field) {
        if(err) throw err;

        return callback(result);
    });

}


exports.getMessDetails = function (callback) {
    var dml = `select 
    users.user_id, users.name, users.email, users.contact_no, mess.company_name, mess.company_loc
    from users,mess
    where users.user_id=mess.mess_id`;

    connection.query(dml,function(err,result,field) {
        if(err) throw err;

        return callback(result);
    });

}



exports.addMess = function (data,callback) {
    var dml = `select user_id from users where email = '${data.email}'`

    connection.query(dml,function(err,result,field) {
        if(err) throw err;

        var user_id = result[0].user_id;

        dml=`insert into mess values(${user_id},'${data.company_name}','${data.company_loc}')`;

        connection.query(dml,function(err,result) {
            if(err) throw err;

        });
    
    });

}


exports.editMess = function (data,mess_id,callback) {
    var dml = `update mess
    set company_name='${data.company_name}', company_loc='${data.company_loc}'
    where mess_id=${mess_id}`;

    connection.query(dml,function(err,result) {
        if(err) throw err;

        return callback();
    });

}


exports.deleteUser = function (user_id,callback) {
    var dml = `delete from users where user_id=${user_id}`;

    connection.query(dml,function(err,result,field) {
        if(err) throw err;

        return callback();
    
    });

}



exports.addCampus = function (data,callback) {
    var dml = `insert into campus(campus_name,campus_loc) values('${data.campus_name}','${data.campus_loc}')`

    connection.query(dml,function(err,result) {
        if(err) throw err;

        return callback();
    });

}


exports.editCampus = function (data,campus_id,callback) {
    var dml = `update campus
    set campus_name='${data.campus_name}',campus_loc='${data.campus_loc}'
    where campus_id=${campus_id}`;

    connection.query(dml,function(err,result) {
        if(err) throw err;

        return callback();
    });

}


exports.deleteCampus = function (campus_id,callback) {
    var dml = `delete from campus where campus_id = ${campus_id}`;

    connection.query(dml,function(err,result) {
        if(err) throw err;

        return callback();
    });

}


/*exports.getCampusDetails = function (callback) {
    var dml = `select 
    campus.campus_id,campus.campus_name,campus.campus_loc,courses.course_id,courses.degree,courses.course_name,courses.no_of_years
    from campus,courses
    where
    campus.campus_id=courses.campus_id`;

    connection.query(dml,function(err,result,field) {
        if(err) throw err;

        return callback(result);
    });

}*/


exports.getAllCampus = function (callback) {
    var dml = `select 
    campus.campus_id,campus.campus_name,campus.campus_loc
    from campus`;

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



exports.addCourse = function (data,campus_id,callback) {
    var dml = `insert into courses(campus_id,degree,course_name,no_of_years) values(${campus_id},'${data.degree}','${data.course_name}',${data.no_of_years})`

    connection.query(dml,function(err,result) {
        if(err) throw err;

        return callback();
    });

}


exports.editCourse = function (data,course_id,callback) {
    var dml = `update courses
    set degree='${data.degree}',course_name='${data.course_name}',no_of_years=${data.no_of_years}
    where course_id=${course_id}`;

    connection.query(dml,function(err,result) {
        if(err) throw err;

        return callback();
    });

}



exports.deleteCourse = function (course_id,callback) {
    var dml = `delete from courses where course_id = ${course_id}`;

    connection.query(dml,function(err,result) {
        if(err) throw err;

        return callback();
    });

}



exports.getLeaveForms = function (warden_id, callback) {
    var dml = `select 
        leave_form_request.request_id, leave_form_request.student_id, users.name, users.contact_no, campus.campus_name, courses.course_name, students.batch, leave_form_request.request_date, leave_form_request.from_date, leave_form_request.to_date, leave_form_request.reason, leave_form_request.status
    from 
        leave_form_request, wardens, students, warden_students, users, campus, courses
    where
        leave_form_request.student_id=students.student_id
        and
        warden_students.campus_id=students.campus_id
        and
        warden_students.batch=students.batch
        and
        warden_students.warden_id=wardens.warden_id
        and
        users.user_id=students.student_id
        and 
        students.campus_id=campus.campus_id
        and
        students.course_id=courses.course_id
        and
        leave_form_request.status='NOT_VIEWED'
        and
        wardens.warden_id=${warden_id}
    order by
        leave_form_request.request_date DESC`;

    connection.query(dml,function(err,result,field) {
        if(err) throw err;

        return callback(result);
    });

}


exports.getLeaveFormsByStudentId = function (warden_id, student_id, callback) {
    var dml = `select 
        leave_form_request.request_id, leave_form_request.student_id, users.name, users.contact_no, campus.campus_name, courses.course_name, students.batch, leave_form_request.request_date, leave_form_request.from_date, leave_form_request.to_date, leave_form_request.reason, leave_form_request.status
    from 
        leave_form_request, wardens, students, warden_students, users, campus, courses
    where
        leave_form_request.student_id=students.student_id
        and
        warden_students.campus_id=students.campus_id
        and
        warden_students.batch=students.batch
        and
        warden_students.warden_id=wardens.warden_id
        and
        users.user_id=students.student_id
        and 
        students.campus_id=campus.campus_id
        and
        students.course_id=courses.course_id
        and
        leave_form_request.status='NOT_VIEWED'
        and
        wardens.warden_id=${warden_id}
        and
        students.student_id=${student_id}
    order by
        leave_form_request.request_date DESC`;

    connection.query(dml,function(err,result,field) {
        if(err) throw err;

        return callback(result);
    });

}


exports.getLeaveFormsByDateStatus = function (warden_id, status, from_date, to_date, callback) {
    var dml = `select 
        leave_form_request.request_id, leave_form_request.student_id, users.name, users.contact_no, campus.campus_name, courses.course_name, students.batch, leave_form_request.request_date, leave_form_request.from_date, leave_form_request.to_date, leave_form_request.reason, leave_form_request.status
    from 
        leave_form_request, wardens, students, warden_students, users, campus, courses
    where
        leave_form_request.student_id=students.student_id
        and
        warden_students.campus_id=students.campus_id
        and
        warden_students.batch=students.batch
        and
        warden_students.warden_id=wardens.warden_id
        and
        users.user_id=students.student_id
        and 
        students.campus_id=campus.campus_id
        and
        students.course_id=courses.course_id
        and
        leave_form_request.status='${status}'
        and
        wardens.warden_id=${warden_id}
        and
        leave_form_request.request_date>='${from_date}'
        and
        leave_form_request.request_date<='${to_date}'
    order by
        leave_form_request.request_date DESC`;

    connection.query(dml,function(err,result,field) {
        if(err) throw err;

        return callback(result);
    });

}


exports.changeLeaveFormStatus = function (request_id, status, callback) {
    var dml = `update leave_form_request
    set status='${status}'
    where request_id=${request_id}`;

    connection.query(dml,function(err,result,field) {
        if(err) throw err;

        return callback(result);
    });

}



exports.addWardenStudentRel = function (data,callback) {
    var dml = `select * from warden_students where warden_id=${data.warden_id} and campus_id=${data.campus_id} and batch=${data.batch}`;

    connection.query(dml,function(err,result) {
        if(err) throw err;

        if(result.length==0)
        {
            dml = `insert into warden_students values(${data.warden_id},${data.campus_id},${data.batch})`;

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


exports.getWardenStudentRel = function (callback) {
    var dml = `select 
    wardens.warden_id, users.name, warden_students.campus_id, campus.campus_name, campus.campus_loc, warden_students.batch
    from 
        wardens,campus,warden_students,users
    where
        users.user_id=wardens.warden_id
        and
        warden_students.warden_id=wardens.warden_id
        and
        warden_students.campus_id=campus.campus_id`;

    connection.query(dml,function(err,result,field) {
        if(err) throw err;

        return callback(result);
    });

}


exports.deleteWardenStudentRel = function (warden_id,campus_id,batch,callback) {
    var dml = `select * from warden_students where warden_id=${warden_id} and campus_id=${campus_id} and batch=${batch}`;

    connection.query(dml,function(err,result) {
        if(err) throw err;

        if(result.length==0)
        {
            return callback(false);
        }
        else
        {
            dml = `delete from warden_students
            where warden_id=${warden_id} and campus_id=${campus_id} and batch=${batch}`;

            connection.query(dml,function(err,result) {
                if(err) throw err;

                return callback(true);

            });
        }
    });

}


exports.addMessStudentRel = function (data,callback) {
    var dml = `select * from mess_students where mess_id=${data.mess_id} and campus_id=${data.campus_id} and batch=${data.batch}`;

    connection.query(dml,function(err,result) {
        if(err) throw err;

        if(result.length==0)
        {
            dml = `insert into mess_students values(${data.mess_id},${data.campus_id},${data.batch})`;

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


exports.getMessStudentRel = function (callback) {
    var dml = `select 
    mess.mess_id, users.name, mess_students.campus_id, campus.campus_name, campus.campus_loc, mess_students.batch
    from 
        mess,campus,mess_students,users
    where
        users.user_id=mess.mess_id
        and
        mess_students.mess_id=mess.mess_id
        and
        mess_students.campus_id=campus.campus_id`;

    connection.query(dml,function(err,result,field) {
        if(err) throw err;

        return callback(result);
    });

}


exports.deleteMessStudentRel = function (mess_id,campus_id,batch,callback) {
    var dml = `select * from mess_students where mess_id=${mess_id} and campus_id=${campus_id} and batch=${batch}`;

    connection.query(dml,function(err,result) {
        if(err) throw err;

        if(result.length==0)
        {
            return callback(false);
        }
        else
        {
            dml = `delete from mess_students
            where mess_id=${mess_id} and campus_id=${campus_id} and batch=${batch}`;

            connection.query(dml,function(err,result) {
                if(err) throw err;

                return callback(true);

            });
        }
    });

}


exports.getAllComplaints = function (warden_id, complaint_type, status, from_date, to_date, callback) {
    var dml = `select 
        complaint_reg.complaint_id, complaint_reg.student_id, users.name, users.contact_no, campus.campus_name, courses.course_name, students.batch, students.room_no, complaint_reg.complaint_date, complaint_reg.complaint_type, complaint_reg.complaint, complaint_reg.status
    from 
        complaint_reg, wardens, students, warden_students, users, campus, courses
    where
        complaint_reg.student_id=students.student_id
        and
        warden_students.campus_id=students.campus_id
        and
        warden_students.batch=students.batch
        and
        warden_students.warden_id=wardens.warden_id
        and
        users.user_id=students.student_id
        and 
        students.campus_id=campus.campus_id
        and
        students.course_id=courses.course_id
        and
        wardens.warden_id=${warden_id}
        and
        complaint_reg.complaint_type='${complaint_type}'
        and
        complaint_reg.status='${status}'
        and
        complaint_reg.complaint_date>='${from_date}'
        and
        complaint_reg.complaint_date<='${to_date}'
    order by
        complaint_reg.complaint_date DESC`;

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