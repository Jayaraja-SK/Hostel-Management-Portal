drop table warden_students;
drop table mess_students;

drop table leave_form_request;
drop table complaint_reg;
drop table mess_bill_cancellation;
drop table mess_bill_payment;

drop table students;
drop table wardens;
drop table mess;
drop table users;

drop table courses;
drop table campus;

# REM "USERS TABLE"

create table users(
    user_id int PRIMARY KEY AUTO_INCREMENT,
    email varchar(50) UNIQUE,
    name varchar(50),
    contact_no varchar(10),
    role varchar(20) CHECK (role in ('WARDEN','STUDENT','MESS','SUBWARDEN')),
    password varchar(255)
);


# REM "CAMPUS DETAILS"

create table campus(
    campus_id int PRIMARY KEY AUTO_INCREMENT,
    campus_name varchar(30),
    campus_loc varchar(30)
);

create table courses(
    course_id int PRIMARY KEY AUTO_INCREMENT,
    campus_id int,
    degree varchar(10),
    course_name varchar(20),
    no_of_years int,
    FOREIGN KEY (campus_id) REFERENCES campus(campus_id) ON DELETE CASCADE
);


insert into campus(campus_name,campus_loc) values("SSN","CHENNAI");
insert into courses(campus_id,degree,course_name,no_of_years) values(1,'BE','CSE',4);



# REM "STUDENTS"

create table students(
    student_id int PRIMARY KEY,
    dob date,
    gender char(1) CHECK (gender in ('M','F')),
    campus_id int,
    course_id int,
    batch int,
    room_no varchar(5),
    FOREIGN KEY (student_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (campus_id) REFERENCES campus(campus_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);


# REM "WARDEN"

create table wardens(
    warden_id int PRIMARY KEY,  
    dob date,
    doj date,
    FOREIGN KEY (warden_id) REFERENCES users(user_id) ON DELETE CASCADE
);


# REM "MESS"

create table mess(
    mess_id int PRIMARY KEY,
    company_name varchar(50),
    company_loc varchar(50),
    FOREIGN KEY (mess_id) REFERENCES users(user_id) ON DELETE CASCADE
);


# REM "STUDENTS AND WARDENS"

create table warden_students(
    warden_id int,
    campus_id int,
    batch int,
    FOREIGN KEY (warden_id) REFERENCES wardens(warden_id) ON DELETE CASCADE,
    FOREIGN KEY (campus_id) REFERENCES campus(campus_id) ON DELETE CASCADE
);


# REM "MESS INCHARGE AND STUDENTS"

create table mess_students(
    mess_id int,
    campus_id int,
    batch int,
    FOREIGN KEY (mess_id) REFERENCES mess(mess_id) ON DELETE CASCADE,
    FOREIGN KEY (campus_id) REFERENCES campus(campus_id) ON DELETE CASCADE
);


# REM "LEAVE FORM REQUEST"

create table leave_form_request(
    request_id int PRIMARY KEY AUTO_INCREMENT,
    student_id int,
    request_date date,
    from_date date,
    to_date date,
    reason varchar(50),
    status varchar(20) CHECK (status in ('NOT_VIEWED','ACCEPTED','REJECTED')),
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);


# REM "COMPLAINT STATUS"

create table complaint_reg(
    complaint_id int PRIMARY KEY AUTO_INCREMENT,
    student_id int,
    complaint_date date,
    complaint_type varchar(20) CHECK (complaint_type in ('ELECTRICAL','FURNITURE','PLUMBING','WIFI')),
    complaint varchar(100),
    status varchar(20) CHECK (status in ('RESOLVED','NOT_RESOLVED')),
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);


# REM "MESS BILL CANCELLATION"

create table mess_bill_cancellation(
    student_id int,
    request_date date,
    from_date date,
    to_date date,
    status int(1) CHECK (status in (0,1)),
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);


# REM "MESS BILL PAYMENT"

create table mess_bill_payment(
    student_id int,
    mess_id int,
    bill_month int,
    bill_year int,
    status varchar(20) CHECK(status in ('PAID','UNPAID','FAILED')),
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (mess_id) REFERENCES mess(mess_id) ON DELETE CASCADE
);

