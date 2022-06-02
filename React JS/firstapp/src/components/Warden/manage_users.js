import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import {useNavigate } from "react-router-dom";
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';


function convertDateToUTC(date) {
	var d = new Date(date);
	return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
  }


const AddStudent = () => {

    const navigate = useNavigate();

	const [campus, setCampus] = useState([]);

	const [courses, setCourses] = useState([]);

	const gender = [{id: 1, value: "M"}, {id: 2, value: "F"}];

	useEffect(() => {
		axios.get("http://localhost:8080/warden/campus",{ headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")},data}).then((res) => {
			if(res.data === 'INVALID TOKEN' || res.data === 'NO TOKEN')
			{
				navigate("/");
				sessionStorage.clear();
			}
			else if(res.data === 'ACCESS DENIED')
			{
				navigate("/");
				sessionStorage.clear();
			}

			var i;

			for(i=0;i<res.data.length;i++)
			{
				res.data[i]["value"]=res.data[i].campus_name+" "+res.data[i].campus_loc;

				delete res.data[i]["campus_name"];
				delete res.data[i]["campus_loc"];
			}

			setCampus(res.data);
		});

	});
	
	const [data, setData] = useState({
		email: "",
        name: "",
        contact_no: null,
        role: "STUDENT",
		password: "",
        dob: null,
        gender: "",
        batch: null,
        campus_id: null,
        course_id: null,
		room_no: null
	  });

    const changeHandler = (e) => {
		setData({ ...data, [e.target.name]: e.target.value });
	};

	const getCourses = () => {
		axios.get("http://localhost:8080/warden/campus/"+document.getElementById("campus_id").value+"/courses", { headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")},data}).then((res) => {
			if(res.data === 'INVALID TOKEN' || res.data === 'NO TOKEN')
			{
				navigate("/");
				sessionStorage.clear();
			}
			else if(res.data === 'ACCESS DENIED')
			{
				navigate("/");
				sessionStorage.clear();
			}
			
			var i;

			for(i=0;i<res.data.length;i++)
			{
				res.data[i]["value"]=res.data[i].degree+" "+res.data[i].course_name;

				delete res.data[i]["course_name"];
				delete res.data[i]["degree"];
				delete res.data[i]["no_of_years"];
			}

			setCourses(res.data);
    });
	};

    const notify = (e) => toast(e);

	const submitHandler = (e) => {
		e.preventDefault();

		axios.post("http://localhost:8080/warden/user/student", { headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")},data}).then((res) => {
			if(res.data === 'INVALID TOKEN' || res.data === 'NO TOKEN')
			{
				navigate("/");
				sessionStorage.clear();
			}
			else if(res.data === 'ACCESS DENIED')
			{
				navigate("/");
				sessionStorage.clear();
			}
			
			if(res.data === true)
			{
				document.getElementById("add_student").reset();
				notify("STUDENT ADDED SUCCESSFULLY");
			}
			else
			{
				document.getElementById("email").value="";
				notify("EMAIL ID ALREADY EXISTS");
			}
    });
	};

	return(
		<>
			<div className="main_content">
				<div className="header">Add Student</div>
				<div className="info">
					<div className="container">
						<form id="add_student" onSubmit={submitHandler}>
							<label>Email</label>
							<input type="email" id="email" name="email" onChange={changeHandler} required/>
							<br/><br/>

							<label>Name</label>
							<input type="text" id="name" name="name" onChange={changeHandler} required/>
							<br/><br/>

							<label>Contact No</label>
							<input type="number" id="contact_no" name="contact_no" onChange={changeHandler} min="6000000000" max="9999999999" required/>
							<br/><br/>

							<label>Password</label>
							<input type="password" id="password" name="password" onChange={changeHandler} required/>
							<br/><br/>

							<label>DOB</label>
							<input type="date" id="dob" name="dob" onChange={changeHandler} required/>
							<br/><br/>

							<label>Gender</label>
							<select name="gender" id="gender" onChange={changeHandler} required>
								<option value="">Select Gender</option> 
								{
									gender.map((gender,key) => {
										return <option key={key} value={gender.value}>{gender.value}</option>;
									})
								}
							</select>
							<br/><br/>

							<label>Campus</label>
							<select name="campus_id" id="campus_id" onChange={e => {changeHandler(e);getCourses();}} required>
								<option value="">Select Campus</option> 
								{
									campus.map((campus,key) => {
										return <option key={key} value={campus.campus_id}>{campus.value}</option>;
									})
								}
							</select>
							<br/><br/>

							<label>Course</label>
							<select name="course_id" id="course_id" onChange={changeHandler} required>
								<option value="">Select Course</option> 
								{
									courses.map((courses,key) => {
										return <option key={key} value={courses.course_id}>{courses.value}</option>;
									})
								}
							</select>
							<br/><br/>

							<label>Batch</label>
							<input type="number" id="batch" name="batch" onChange={changeHandler} required/>
							<br/><br/>

							<label>Room No</label>
							<input type="text" id="room_no" name="room_no" onChange={changeHandler} />
							<br/><br/>
							<br/><br/>

							<button type="submit">Submit</button>
						</form>
					</div>
				</div>
				<ToastContainer/>
			</div>
		</>
		);
};


const AddWarden = () => {

    const navigate = useNavigate();
	
	const [data, setData] = useState({
		email: "",
        name: "",
        contact_no: null,
        role: "SUBWARDEN",
		password: "",
		dob: null,
		doj: null
	  });

    const changeHandler = (e) => {
		setData({ ...data, [e.target.name]: e.target.value });
	};

    const notify = (e) => toast(e);

	const submitHandler = (e) => {
		e.preventDefault();

		axios.post("http://localhost:8080/warden/user/warden", { headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")},data}).then((res) => {
			if(res.data === 'INVALID TOKEN' || res.data === 'NO TOKEN')
			{
				navigate("/");
				sessionStorage.clear();
			}
			else if(res.data === 'ACCESS DENIED')
			{
				navigate("/");
				sessionStorage.clear();
			}
			
			if(res.data === true)
			{
				document.getElementById("add_warden").reset();
				notify("WARDEN ADDED SUCCESSFULLY");
			}
			else
			{
				document.getElementById("email").value="";
				notify("EMAIL ID ALREADY EXISTS");
			}
    });

	};

	return(
		<>
			<div className="main_content">
				<div className="header">Add Warden</div>
				<div className="info">
					<div className="container">
						<form id="add_warden" onSubmit={submitHandler}>
							<label>Email</label>
							<input type="email" id="email" name="email" onChange={changeHandler} required/>
							<br/><br/>

							<label>Name</label>
							<input type="text" id="name" name="name" onChange={changeHandler} required/>
							<br/><br/>

							<label>Contact No</label>
							<input type="number" id="contact_no" name="contact_no" onChange={changeHandler} min="6000000000" max="9999999999" required/>
							<br/><br/>

							<label>Password</label>
							<input type="password" id="password" name="password" onChange={changeHandler} required/>
							<br/><br/>

							<label>DOB</label>
							<input type="date" id="dob" name="dob" onChange={changeHandler} required/>
							<br/><br/>

							<label>DOJ</label>
							<input type="date" id="doj" name="doj" onChange={changeHandler} required/>
							<br/><br/>
							<br/><br/>

							<button type="submit">Submit</button>
						</form>
					</div>
				</div>
				<ToastContainer/>
			</div>
		</>
		);
};


const AddMess = () => {

    const navigate = useNavigate();
	
	const [data, setData] = useState({
		email: "",
        name: "",
        contact_no: null,
        role: "MESS",
		password: "",
		company_name: "",
		company_loc: ""
	  });

    const changeHandler = (e) => {
		setData({ ...data, [e.target.name]: e.target.value });
	};

    const notify = (e) => toast(e);

	const submitHandler = (e) => {
		e.preventDefault();

		axios.post("http://localhost:8080/warden/user/mess", { headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")},data}).then((res) => {
			if(res.data === 'INVALID TOKEN' || res.data === 'NO TOKEN')
			{
				navigate("/");
				sessionStorage.clear();
			}
			else if(res.data === 'ACCESS DENIED')
			{
				navigate("/");
				sessionStorage.clear();
			}
			
			if(res.data === true)
			{
				document.getElementById("add_mess").reset();
				notify("MESS ADDED SUCCESSFULLY");
			}
			else
			{
				document.getElementById("email").value="";
				notify("EMAIL ID ALREADY EXISTS");
			}
    });
		
	};

	return(
		<>
			<div className="main_content">
				<div className="header">Add Mess</div>
				<div className="info">
					<div className="container">
						<form id="add_mess" onSubmit={submitHandler}>
							<label>Email</label>
							<input type="email" id="email" name="email" onChange={changeHandler} required/>
							<br/><br/>

							<label>Name</label>
							<input type="text" id="name" name="name" onChange={changeHandler} required/>
							<br/><br/>

							<label>Contact No</label>
							<input type="number" id="contact_no" name="contact_no" onChange={changeHandler} min="6000000000" max="9999999999" required/>
							<br/><br/>

							<label>Password</label>
							<input type="password" id="password" name="password" onChange={changeHandler} required/>
							<br/><br/>

							<label>Company Name</label>
							<input type="text" id="company_name" name="company_name" onChange={changeHandler} required/>
							<br/><br/>

							<label>Company Location</label>
							<input type="text" id="company_loc" name="company_loc" onChange={changeHandler} required/>
							<br/><br/>
							<br/><br/>
							
							<button type="submit">Submit</button>
						</form>
					</div>
				</div>
				<ToastContainer/>
			</div>
		</>
		);
};


const EditUser = () => {

	const navigate = useNavigate();

	const [data, setData] = useState({
		user_id: sessionStorage.getItem("edit_user_id"),
		name: sessionStorage.getItem("edit_name"),
		email: sessionStorage.getItem("edit_email"),
		contact_no: sessionStorage.getItem("edit_contact_no")
	  });
	
	const changeHandler = (e) => {
		setData({ ...data, [e.target.name]: e.target.value });
	};

	const notify = (e) => toast(e);

	const submitHandler = (e) => {
		e.preventDefault();

		axios.put("http://localhost:8080/warden/user/"+data.user_id, { headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")},data}).then((res) => {
			if(res.data === 'INVALID TOKEN' || res.data === 'NO TOKEN')
			{
				navigate("/");
				sessionStorage.clear();
			}
			else if(res.data === 'ACCESS DENIED')
			{
				navigate("/");
				sessionStorage.clear();
			}
			
			sessionStorage.removeItem("edit_user_id");
			sessionStorage.removeItem("edit_name");
			sessionStorage.removeItem("edit_email");
			sessionStorage.removeItem("edit_contact_no");

			if(res.data === true)
			{
				//document.getElementById("edit_user").reset();
				notify("DATA EDITED SUCCESSFULLY");
			}
			else
			{
				document.getElementById("email").value="";
				notify("EMAIL ALREADY EXISTS");
			}

    });
	}

	return(
		<>
			<div className="main_content">
				<div className="header">Edit User Details</div>
				<div className="info">
					<div className="container">
						<form id="edit_user" onSubmit={submitHandler}>
							<label>User Id</label>
							<input type="text" id="user_id" name="user_id" defaultValue={data.user_id} disabled={true} />
							<br/><br/>

							<label>Email</label>
							<input type="email" id="email" name="email" defaultValue={data.email} onChange={changeHandler} />
							<br/><br/>

							<label>Name</label>
							<input type="text" id="name" name="name" defaultValue={data.name} onChange={changeHandler} />
							<br/><br/>

							<label>Contact No</label>
							<input type="number" id="contact_no" name="contact_no" defaultValue={data.contact_no} onChange={changeHandler} />
							<br/><br/>
							<br/><br/>

							<button type="submit">Submit</button>
						</form>
					</div>
				</div>
				<ToastContainer/>
			</div>
		</>
		);
};


const EditWarden = () => {

	const navigate = useNavigate();

	const [data, setData] = useState({
		user_id: sessionStorage.getItem("warden_user_id"),
		name: sessionStorage.getItem("warden_name"),
		email: sessionStorage.getItem("warden_email"),
		warden_dob: sessionStorage.getItem("warden_dob"),
		warden_doj: sessionStorage.getItem("warden_doj")
	  });
	
	const changeHandler = (e) => {
		setData({ ...data, [e.target.name]: e.target.value });
	};

	const notify = (e) => toast(e);

	const submitHandler = (e) => {
		e.preventDefault();

		axios.put("http://localhost:8080/warden/user/warden/"+data.user_id, { headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")},data}).then((res) => {
			if(res.data === 'INVALID TOKEN' || res.data === 'NO TOKEN')
			{
				navigate("/");
				sessionStorage.clear();
			}
			else if(res.data === 'ACCESS DENIED')
			{
				navigate("/");
				sessionStorage.clear();
			}
			
			sessionStorage.removeItem("warden_user_id");
			sessionStorage.removeItem("warden_name");
			sessionStorage.removeItem("warden_email");
			sessionStorage.removeItem("warden_dob");
			sessionStorage.removeItem("warden_doj");

			notify("DATA EDITED SUCCESSFULLY");
			

			navigate("/warden_dashboard/view_wardens");
    });
	}

	return(
		<>
			<div className="main_content">
				<div className="header">Edit Warden Details - {data.name} - {data.email}</div>
				<div className="info">
					<div className="container">
						<form onSubmit={submitHandler}>
							<label>Warden Id</label>
							<input type="text" id="user_id" name="user_id" defaultValue={data.user_id} disabled={true} />
							<br/><br/>

							<label>DOB</label>
							<input type="date" id="warden_dob" name="warden_dob" defaultValue={data.warden_dob} onChange={changeHandler} />
							<br/><br/>

							<label>DOJ</label>
							<input type="date" id="warden_doj" name="warden_doj" defaultValue={data.warden_doj} onChange={changeHandler} />
							<br/><br/>
							<br/><br/>

							<button type="submit">Submit</button>
						</form>
					</div>
				</div>
				<ToastContainer/>
			</div>
		</>
		);
};


const EditStudent = () => {

	const navigate = useNavigate();

	const [data, setData] = useState({
		user_id: sessionStorage.getItem("student_user_id"),
		name: sessionStorage.getItem("student_name"),
		email: sessionStorage.getItem("student_email"),
		dob: sessionStorage.getItem("student_dob"),
		gender: sessionStorage.getItem("student_gender"),
		room_no: sessionStorage.getItem("student_room_no"),
		campus_id: sessionStorage.getItem("student_campus_id"),
		campus_info: sessionStorage.getItem("student_campus_info"),
		course_id: sessionStorage.getItem("student_course_id"),
		course_info: sessionStorage.getItem("student_course_info"),
		batch: sessionStorage.getItem("student_batch")
	  });

	
	  const [campus, setCampus] = useState([]);

	  const [courses, setCourses] = useState([]);

	  const gender = [{id: 1, value: "M"}, {id: 2, value: "F"}];

  
	  useEffect(() => {
		  axios.get("http://localhost:8080/warden/campus", { headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")},data}).then((res) => {
				if(res.data === 'INVALID TOKEN' || res.data === 'NO TOKEN')
				{
					navigate("/");
					sessionStorage.clear();
				}
				else if(res.data === 'ACCESS DENIED')
				{
					navigate("/");
					sessionStorage.clear();
				}

				var i;
	
				for(i=0;i<res.data.length;i++)
				{
					res.data[i]["value"]=res.data[i].campus_name+" "+res.data[i].campus_loc;
	
					delete res.data[i]["campus_name"];
					delete res.data[i]["campus_loc"];
				}
	
				setCampus(res.data);
		  });
  
	  });
  
  
  
	  const getCourses = () => {
		  document.getElementById("default_course").value="";

		  axios.get("http://localhost:8080/warden/campus/"+document.getElementById("campus_id").value+"/courses", { headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")},data}).then((res) => {
			if(res.data === 'INVALID TOKEN' || res.data === 'NO TOKEN')
			{
				navigate("/");
				sessionStorage.clear();
			}
			else if(res.data === 'ACCESS DENIED')
			{
				navigate("/");
				sessionStorage.clear();
			}
			
			var i;
  
			  for(i=0;i<res.data.length;i++)
			  {
				  res.data[i]["value"]=res.data[i].degree+" "+res.data[i].course_name;
  
				  delete res.data[i]["course_name"];
				  delete res.data[i]["degree"];
				  delete res.data[i]["no_of_years"];
			  }
  
			  setCourses(res.data);
	  });
	  };
	
	const changeHandler = (e) => {
		setData({ ...data, [e.target.name]: e.target.value });
	};

	const notify = (e) => toast(e);

	const submitHandler = (e) => {
		e.preventDefault();

		axios.put("http://localhost:8080/warden/user/student/"+data.user_id, { headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")},data}).then((res) => {
			if(res.data === 'INVALID TOKEN' || res.data === 'NO TOKEN')
			{
				navigate("/");
				sessionStorage.clear();
			}
			else if(res.data === 'ACCESS DENIED')
			{
				navigate("/");
				sessionStorage.clear();
			}
			
			sessionStorage.removeItem("student_user_id");
			sessionStorage.removeItem("student_name");
			sessionStorage.removeItem("student_email");
			sessionStorage.removeItem("student_dob");
			sessionStorage.removeItem("student_gender");
			sessionStorage.removeItem("student_room_no");
			sessionStorage.removeItem("student_campus_id");
			sessionStorage.removeItem("student_campus_info");
			sessionStorage.removeItem("student_course_id");
			sessionStorage.removeItem("student_course_info");
			sessionStorage.removeItem("student_batch");

			notify("DATA EDITED SUCCESSFULLY");

			navigate("/warden_dashboard/view_students");
    });
	}

	return(
		<>
			<div className="main_content">
				<div className="header">Edit Student Details - {data.name} - {data.email}</div>
				<div className="info">
					<div className="container">
						<form onSubmit={submitHandler}>
							<label>Student Id</label>
							<input type="text" id="user_id" name="user_id" defaultValue={data.user_id} disabled={true} />
							<br/><br/>

							<label>DOB</label>
							<input type="date" id="dob" name="dob" defaultValue={data.dob} onChange={changeHandler} />
							<br/><br/>

							<label>Gender</label>
							<select name="gender" id="gender" onChange={changeHandler} required>
								<option value={data.gender}>Change Gender</option> 
								{
									gender.map((gender,key) => {
										return <option key={key} value={gender.value}>{gender.value}</option>;
									})
								}
							</select>
							<br/><br/>

							<label>Room No</label>
							<input type="text" id="room_no" name="room_no" defaultValue={data.room_no} onChange={changeHandler} />
							<br/><br/>

							<label>Campus</label>
							<select name="campus_id" id="campus_id" onChange={e => {changeHandler(e);getCourses();}} required>
								<option value={data.campus_info}>Change Campus</option> 
								{
									campus.map((campus,key) => {
										return <option key={key} value={campus.campus_id}>{campus.value}</option>;
									})
								}
							</select>
							<br/><br/>

							<label>Course</label>
							<select name="course_id" id="course_id" onChange={changeHandler} required>
								<option value={data.course_info} id="default_course">Change Course</option> 
								{
									courses.map((courses,key) => {
										return <option key={key} value={courses.course_id}>{courses.value}</option>;
									})
								}
							</select>
							<br/><br/>

							<label>Batch</label>
							<input type="number" id="batch" name="batch" onChange={changeHandler} defaultValue={data.batch} />
							<br/><br/>
							<br/><br/>

							<button type="submit">Submit</button>
						</form>
					</div>
				</div>
				<ToastContainer/>
			</div>
		</>
		);
};



const EditMess = () => {

	const navigate = useNavigate();

	const [data, setData] = useState({
		user_id: sessionStorage.getItem("mess_user_id"),
		name: sessionStorage.getItem("mess_name"),
		email: sessionStorage.getItem("mess_email"),
		company_name: sessionStorage.getItem("mess_company_name"),
		company_loc: sessionStorage.getItem("mess_company_loc")
	  });
	
	const changeHandler = (e) => {
		setData({ ...data, [e.target.name]: e.target.value });
	};

	const notify = (e) => toast(e);

	const submitHandler = (e) => {
		e.preventDefault();

		axios.put("http://localhost:8080/warden/user/mess/"+data.user_id, { headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")},data}).then((res) => {
			if(res.data === 'INVALID TOKEN' || res.data === 'NO TOKEN')
			{
				navigate("/");
				sessionStorage.clear();
			}
			else if(res.data === 'ACCESS DENIED')
			{
				navigate("/");
				sessionStorage.clear();
			}
			
			sessionStorage.removeItem("mess_user_id");
			sessionStorage.removeItem("mess_name");
			sessionStorage.removeItem("mess_email");
			sessionStorage.removeItem("mess_company_name");
			sessionStorage.removeItem("mess_company_loc");

			notify("DATA EDITED SUCCESSFULLY");

			navigate("/warden_dashboard/view_mess");
    });
	}

	return(
		<>
		<div className="main_content">
			<div className="header">Edit Mess Details - {data.name} - {data.email}</div>
			<div className="info">
				<div className="container">
					
					<form onSubmit={submitHandler}>
						<label>Mess Id</label>
						<input type="text" id="user_id" name="user_id" defaultValue={data.user_id} disabled={true} />
						<br/><br/>

						<label>Company Name</label>
						<input type="text" id="company_name" name="company_name" defaultValue={data.company_name} onChange={changeHandler} />
						<br/><br/>

						<label>Company Location</label>
						<input type="text" id="company_loc" name="company_loc" defaultValue={data.company_loc} onChange={changeHandler} />

						<br/><br/>
						<br/><br/>

						<button type="submit">Submit</button>
					</form>
				</div>
			</div>
				<ToastContainer/>
			</div>
		</>
		);
};


const ViewStudents = () => {

	const navigate = useNavigate();

	const notify = (e) => toast(e);

	const [data, setData] = useState([]);

	const [campus, setCampus] = useState([]);

	const [courses, setCourses] = useState([]);

	const [filter, setFilter] = useState({
		campus_id: null,
		course_id: null,
		batch: null
	  });

	var value;

	useEffect(() => {
		axios.get("http://localhost:8080/warden/campus", { headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")},data}).then((res) => {
			if(res.data === 'INVALID TOKEN' || res.data === 'NO TOKEN')
			{
				navigate("/");
				sessionStorage.clear();
			}
			else if(res.data === 'ACCESS DENIED')
			{
				navigate("/");
				sessionStorage.clear();
			}


			var i;

			for(i=0;i<res.data.length;i++)
			{
				res.data[i]["value"]=res.data[i].campus_name+" "+res.data[i].campus_loc;

				delete res.data[i]["campus_name"];
				delete res.data[i]["campus_loc"];
			}

			setCampus(res.data);
		});

	});


	const changeHandler = (e) => {
		setFilter({ ...filter, [e.target.name]: e.target.value });
	};


	const getCourses = () => {
		axios.get("http://localhost:8080/warden/campus/"+document.getElementById("campus_id").value+"/courses", { headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")},data}).then((res) => {
			if(res.data === 'INVALID TOKEN' || res.data === 'NO TOKEN')
			{
				navigate("/");
				sessionStorage.clear();
			}
			else if(res.data === 'ACCESS DENIED')
			{
				navigate("/");
				sessionStorage.clear();
			}
			
			var i;

			for(i=0;i<res.data.length;i++)
			{
				res.data[i]["value"]=res.data[i].degree+" "+res.data[i].course_name;

				delete res.data[i]["course_name"];
				delete res.data[i]["degree"];
				delete res.data[i]["no_of_years"];
			}

			setCourses(res.data);
    });
	};

	/*const editHandler1 = (id,name,email,contact) => {
		sessionStorage.setItem("edit_user_id",id);
		sessionStorage.setItem("edit_name",name);
		sessionStorage.setItem("edit_email",email);
		sessionStorage.setItem("edit_contact_no",contact);

		navigate("/warden_dashboard/edit_user");

	}

	const editHandler2 = (id,name,email,dob,gender,room_no,campus_id,course_id,batch) => {
		sessionStorage.setItem("student_user_id",id);
		sessionStorage.setItem("student_name",name);
		sessionStorage.setItem("student_email",email);
		sessionStorage.setItem("student_dob",dob);
		sessionStorage.setItem("student_gender",gender);
		sessionStorage.setItem("student_room_no",room_no);
		sessionStorage.setItem("student_campus_id",campus_id);
		sessionStorage.setItem("student_course_id",course_id);
		sessionStorage.setItem("student_batch",batch);

		var i;

		for(i=0;i<campus.length;i++)
		{
			if(campus_id === campus[i].campus_id)
			{
				sessionStorage.setItem("student_campus_info",campus[i].value);
				break;
			}
		}

		for(i=0;i<courses.length;i++)
		{
			if(campus_id === campus[i].campus_id)
			{
				sessionStorage.setItem("student_course_info",courses[i].value);
				break;
			}
		}

		navigate("/warden_dashboard/edit_student");

	}


	const editHandler3 = (id,email) => {
		sessionStorage.setItem("pwd_user_id",id);
		sessionStorage.setItem("pwd_email",email);
		

		navigate("/warden_dashboard/change_pwd");

	}

	const deleteHandler = (id) => {
		axios.delete("http://localhost:8080/warden/user/"+id, { headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")},data}).then((res) => {
			if(res.data === 'INVALID TOKEN' || res.data === 'NO TOKEN')
			{
				navigate("/");
				sessionStorage.clear();
			}
			else if(res.data === 'ACCESS DENIED')
			{
				navigate("/");
				sessionStorage.clear();
			}
			
			window.location.reload();
		});
	}*/


	const changeHandler1 = (e) => {
		value = e.target.value;
	  };


	const setOption = (id,name,email,dob,gender,room_no,campus_id,course_id,batch, contact) => {
		if(value === '1')
		{
			sessionStorage.setItem("edit_user_id",id);
			sessionStorage.setItem("edit_name",name);
			sessionStorage.setItem("edit_email",email);
			sessionStorage.setItem("edit_contact_no",contact);

			navigate("/warden_dashboard/edit_user");
		}
		else if(value === '2')
		{
			sessionStorage.setItem("student_user_id",id);
			sessionStorage.setItem("student_name",name);
			sessionStorage.setItem("student_email",email);
			sessionStorage.setItem("student_dob",dob);
			sessionStorage.setItem("student_gender",gender);
			sessionStorage.setItem("student_room_no",room_no);
			sessionStorage.setItem("student_campus_id",campus_id);
			sessionStorage.setItem("student_course_id",course_id);
			sessionStorage.setItem("student_batch",batch);

			var i;

			for(i=0;i<campus.length;i++)
			{
				if(campus_id === campus[i].campus_id)
				{
					sessionStorage.setItem("student_campus_info",campus[i].value);
					break;
				}
			}

			for(i=0;i<courses.length;i++)
			{
				if(campus_id === campus[i].campus_id)
				{
					sessionStorage.setItem("student_course_info",courses[i].value);
					break;
				}
			}

			navigate("/warden_dashboard/edit_student");
		}
		else if(value === '3')
		{
			sessionStorage.setItem("pwd_user_id",id);
			sessionStorage.setItem("pwd_email",email);
			

			navigate("/warden_dashboard/change_pwd");
		}
		else if(value === '4')
		{
			axios.delete("http://localhost:8080/warden/user/"+id, { headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")},data}).then((res) => {
				if(res.data === 'INVALID TOKEN' || res.data === 'NO TOKEN')
				{
					navigate("/");
					sessionStorage.clear();
				}
				else if(res.data === 'ACCESS DENIED')
				{
					navigate("/");
					sessionStorage.clear();
				}
				
				window.location.reload();
			});
		}
	}

	const filterHandler = (e) => {
		e.preventDefault();

		axios.get("http://localhost:8080/warden/students/campus_id="+filter.campus_id+"&&course_id="+filter.course_id+"&&batch="+filter.batch, { headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")},data}).then((res) => {
			if(res.data === 'INVALID TOKEN' || res.data === 'NO TOKEN')
			{
				navigate("/");
				sessionStorage.clear();
			}
			else if(res.data === 'ACCESS DENIED')
			{
				navigate("/");
				sessionStorage.clear();
			}

			if(res.data.length === 0)
			{
				//notify("NO RECORDS FOUND");
			}

			var i;
			
			for(i=0;i<res.data.length;i++)
			{
				res.data[i]["dob"] = convertDateToUTC(res.data[i]["dob"]);
			}
			
			//document.getElementById("filter").reset();
			setData(res.data);
    });
	}



	return(
		<>
			<div className="main_content">
				<div className="header">View Students</div>
				<div className="info">
					<div className="container">
						<form id="filter" onSubmit={filterHandler}>
							<label>Campus</label>
							<select name="campus_id" id="campus_id" onChange={e => {changeHandler(e);getCourses();}} required>
								<option value="">Select Campus</option> 
								{
									campus.map((campus,key) => {
										return <option key={key} value={campus.campus_id}>{campus.value}</option>;
									})
								}
							</select>
							<br/><br/>

							<label>Course</label>
							<select name="course_id" id="course_id" onChange={changeHandler} required>
								<option value="">Select Course</option> 
								{
									courses.map((courses,key) => {
										return <option key={key} value={courses.course_id}>{courses.value}</option>;
									})
								}
							</select>
							<br/><br/>

							<label>Batch</label>
							<input type="number" id="batch" name="batch" defaultValue={data.company_loc} onChange={changeHandler} required/>
							<br/><br/>
							<br/><br/>

							<button type="submit">Filter</button>
						</form>
					</div>
				</div>

				<div className="info">
					<table>
						<thead>
							<tr>
								<th>Id</th>
								<th>Name</th>
								<th>Email</th>
								<th>Contact No.</th>
								<th>DOB</th>
								<th>Gender</th>
								<th>Room No</th>
							</tr>
						</thead>

						<tbody>
							{data && data.map(data =>
								<tr key={data.user_id}>
									<td>{data.user_id}</td>
									<td>{data.name}</td>
									<td>{data.email}</td>
									<td>{data.contact_no}</td>
									<td>{data.dob}</td>
									<td>{data.gender}</td>
									<td>{data.room_no}</td>
									<td>
										{/*<span className="td-btn">
											<button onClick={() => editHandler1(data.user_id, data.name, data.email, data.contact_no)}>EDIT ACCOUNT INFO</button>
											<button onClick={() => editHandler2(data.user_id, data.name, data.email, data.dob, data.gender, data.room_no, data.campus_id, data.course_id, data.batch)}>EDIT PERSONAL INFO</button>
											<button onClick={() => editHandler3(data.user_id,data.email)}>CHANGE PASSWORD</button>
											<button onClick={() => deleteHandler(data.user_id)}>DELETE</button>
										</span>*/}

									<select name="options" id="options" onChange={(e) => {changeHandler1(e);setOption(data.user_id, data.name, data.email, data.dob, data.gender, data.room_no, data.campus_id, data.course_id, data.batch, data.contact_no)}}>
											<option>OPTIONS</option>
											<option value="1">EDIT ACCOUNT INFO</option>
											<option value="2">EDIT PERSONAL INFO</option>
											<option value="3">CHANGE PASSWORD</option>
											<option value="4">DELETE</option>
										</select>
									</td>
	
								</tr>
							)}
						</tbody>
					</table>
				</div>
				<ToastContainer/>
			</div>
		</>
		);
};


const ViewMess = () => {

	const navigate = useNavigate();

	const notify = (e) => toast(e);

	const [data, setData] = useState([]);

	var value;

	useEffect(() => {
		axios.get("http://localhost:8080/warden/mess", { headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")},data}).then((res) => {
			if(res.data === 'INVALID TOKEN' || res.data === 'NO TOKEN')
			{
				navigate("/");
				sessionStorage.clear();
			}
			else if(res.data === 'ACCESS DENIED')
			{
				navigate("/");
				sessionStorage.clear();
			}

			if(res.data.length === 0)
			{
				//notify("NO RECORDS FOUND");
			}
			
			setData(res.data)
		});

	});

	/*const editHandler1 = (id,name,email,contact) => {
		sessionStorage.setItem("edit_user_id",id);
		sessionStorage.setItem("edit_name",name);
		sessionStorage.setItem("edit_email",email);
		sessionStorage.setItem("edit_contact_no",contact);

		navigate("/warden_dashboard/edit_user");

	}

	const editHandler2 = (id,name,email,company_name,company_loc) => {
		sessionStorage.setItem("mess_user_id",id);
		sessionStorage.setItem("mess_name",name);
		sessionStorage.setItem("mess_email",email);
		sessionStorage.setItem("mess_company_name",company_name);
		sessionStorage.setItem("mess_company_loc",company_loc);

		navigate("/warden_dashboard/edit_mess");

	}


	const editHandler3 = (id,email) => {
		sessionStorage.setItem("pwd_user_id",id);
		sessionStorage.setItem("pwd_email",email);

		navigate("/warden_dashboard/change_pwd");

	}

	const deleteHandler = (id) => {
		axios.delete("http://localhost:8080/warden/user/"+id, { headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")},data}).then((res) => {
			if(res.data === 'INVALID TOKEN' || res.data === 'NO TOKEN')
			{
				navigate("/");
				sessionStorage.clear();
			}
			else if(res.data === 'ACCESS DENIED')
			{
				navigate("/");
				sessionStorage.clear();
			}
			
			window.location.reload();
		});
	}*/


	const changeHandler = (e) => {
		value = e.target.value;
	  };


	const setOption = (id,name,email,company_name,company_loc, contact) => {
		if(value === '1')
		{
			sessionStorage.setItem("edit_user_id",id);
			sessionStorage.setItem("edit_name",name);
			sessionStorage.setItem("edit_email",email);
			sessionStorage.setItem("edit_contact_no",contact);

			navigate("/warden_dashboard/edit_user");
		}
		else if(value === '2')
		{
			sessionStorage.setItem("mess_user_id",id);
			sessionStorage.setItem("mess_name",name);
			sessionStorage.setItem("mess_email",email);
			sessionStorage.setItem("mess_company_name",company_name);
			sessionStorage.setItem("mess_company_loc",company_loc);

			navigate("/warden_dashboard/edit_mess");
		}
		else if(value === '3')
		{
			sessionStorage.setItem("pwd_user_id",id);
			sessionStorage.setItem("pwd_email",email);

			navigate("/warden_dashboard/change_pwd");
		}
		else if(value === '4')
		{
			axios.delete("http://localhost:8080/warden/user/"+id, { headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")},data}).then((res) => {
				if(res.data === 'INVALID TOKEN' || res.data === 'NO TOKEN')
				{
					navigate("/");
					sessionStorage.clear();
				}
				else if(res.data === 'ACCESS DENIED')
				{
					navigate("/");
					sessionStorage.clear();
				}
				
				window.location.reload();
			});
		}
	}



	return(
		<>
		<div className="main_content">
				<div className="header fix">View Mess</div>
				<div className="info">
				<table>
					<thead>
						<tr>
							<th>Id</th>
							<th>Name</th>
							<th>Email</th>
							<th>Contact No.</th>
							<th>Company Name</th>
							<th>Company Location</th>
						</tr>
					</thead>

					<tbody>
						{data && data.map(data =>
							<tr key={data.user_id}>
								<td>{data.user_id}</td>
								<td>{data.name}</td>
								<td>{data.email}</td>
								<td>{data.contact_no}</td>
								<td>{data.company_name}</td>
								<td>{data.company_loc}</td>
								<td>
									{/*<span>
										<button onClick={() => editHandler1(data.user_id, data.name, data.email, data.contact_no)}>EDIT ACCOUNT INFO</button>
										<button onClick={() => editHandler2(data.user_id, data.name, data.email, data.company_name, data.company_loc)}>EDIT PERSONAL INFO</button>
										<button onClick={() => editHandler3(data.user_id,data.email)}>CHANGE PASSWORD</button>
										<button onClick={() => deleteHandler(data.user_id)}>DELETE</button>
									</span>*/}

										<select name="options" id="options" onChange={(e) => {changeHandler(e);setOption(data.user_id, data.name, data.email, data.company_name, data.company_loc, data.contact_no)}}>
											<option>OPTIONS</option>
											<option value="1">EDIT ACCOUNT INFO</option>
											<option value="2">EDIT PERSONAL INFO</option>
											<option value="3">CHANGE PASSWORD</option>
											<option value="4">DELETE</option>
										</select>
								</td>
							</tr>
						)}
					</tbody>
				</table>
</div>
				<ToastContainer/>
			</div>
		</>
		);
};


const ViewWardens = () => {

	const navigate = useNavigate();

	const notify = (e) => toast(e);

	const [data, setData] = useState([]);

	var value;

	useEffect(() => {
		axios.get("http://localhost:8080/warden/wardens", { headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")},data}).then((res) => {
			if(res.data === 'INVALID TOKEN' || res.data === 'NO TOKEN')
			{
				navigate("/");
				sessionStorage.clear();
			}
			else if(res.data === 'ACCESS DENIED')
			{
				navigate("/");
				sessionStorage.clear();
			}

			if(res.data.length === 0)
			{
				//notify("NO RECORDS FOUND");
			}

			var i;
			
			for(i=0;i<res.data.length;i++)
			{
				res.data[i]["dob"] = convertDateToUTC(res.data[i]["dob"]);
				res.data[i]["doj"] = convertDateToUTC(res.data[i]["doj"]);
			}
			
			setData(res.data)
		});

	});

	/*const editHandler1 = (id,name,email,contact) => {
		sessionStorage.setItem("edit_user_id",id);
		sessionStorage.setItem("edit_name",name);
		sessionStorage.setItem("edit_email",email);
		sessionStorage.setItem("edit_contact_no",contact);

		navigate("/warden_dashboard/edit_user");

	}

	const editHandler2 = (id,name,email,dob,doj) => {
		sessionStorage.setItem("warden_user_id",id);
		sessionStorage.setItem("warden_name",name);
		sessionStorage.setItem("warden_email",email);
		sessionStorage.setItem("warden_dob",dob);
		sessionStorage.setItem("warden_doj",doj);

		navigate("/warden_dashboard/edit_warden");

	}


	const editHandler3 = (id,email) => {
		sessionStorage.setItem("pwd_user_id",id);
		sessionStorage.setItem("pwd_email",email);
		

		navigate("/warden_dashboard/change_pwd");

	}

	const deleteHandler = (id) => {
		axios.delete("http://localhost:8080/warden/user/"+id, { headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")},data}).then((res) => {
			if(res.data === 'INVALID TOKEN' || res.data === 'NO TOKEN')
			{
				navigate("/");
				sessionStorage.clear();
			}
			else if(res.data === 'ACCESS DENIED')
			{
				navigate("/");
				sessionStorage.clear();
			}
			
			window.location.reload();
		});
	}*/


	const changeHandler = (e) => {
		value = e.target.value;
	  };


	const setOption = (id,name,email,dob,doj,contact) => {
		if(value === '1')
		{
			sessionStorage.setItem("edit_user_id",id);
			sessionStorage.setItem("edit_name",name);
			sessionStorage.setItem("edit_email",email);
			sessionStorage.setItem("edit_contact_no",contact);

			navigate("/warden_dashboard/edit_user");
		}
		else if(value === '2')
		{
			sessionStorage.setItem("warden_user_id",id);
			sessionStorage.setItem("warden_name",name);
			sessionStorage.setItem("warden_email",email);
			sessionStorage.setItem("warden_dob",dob);
			sessionStorage.setItem("warden_doj",doj);

			navigate("/warden_dashboard/edit_warden");
		}
		else if(value === '3')
		{
			sessionStorage.setItem("pwd_user_id",id);
			sessionStorage.setItem("pwd_email",email);
			

			navigate("/warden_dashboard/change_pwd");
		}
		else if(value === '4')
		{
			axios.delete("http://localhost:8080/warden/user/"+id, { headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")},data}).then((res) => {
				if(res.data === 'INVALID TOKEN' || res.data === 'NO TOKEN')
				{
					navigate("/");
					sessionStorage.clear();
				}
				else if(res.data === 'ACCESS DENIED')
				{
					navigate("/");
					sessionStorage.clear();
				}
				
				window.location.reload();
			});
		}
	}



	return(
		<>
			<div className="main_content">
				<div className="header fix">List of All Wardens</div>
				<div className="info">
					<table>
						<thead>
							<tr>
								<th>Id</th>
								<th>Name</th>
								<th>Email</th>
								<th>Contact No.</th>
								<th>Date of Birth</th>
								<th>Date of Join</th>
							</tr>
						</thead>

						<tbody>
							{data && data.map(data =>
								<tr key={data.user_id}>
									<td>{data.user_id}</td>
									<td>{data.name}</td>
									<td>{data.email}</td>
									<td>{data.contact_no}</td>
									<td>{data.dob}</td>
									<td>{data.doj}</td>
									<td>
										{/*<span>
										<button onClick={() => editHandler1(data.user_id, data.name, data.email, data.contact_no)}>EDIT ACCOUNT INFO</button>
										<button onClick={() => editHandler2(data.user_id, data.name, data.email, data.dob, data.doj)}>EDIT PERSONAL INFO</button>
										<button onClick={() => editHandler3(data.user_id,data.email)}>CHANGE PASSWORD</button>
										<button onClick={() => deleteHandler(data.user_id)}>DELETE</button>
										</span>*/}

										<select name="options" id="options" onChange={(e) => {changeHandler(e);setOption(data.user_id, data.name, data.email, data.dob, data.doj, data.contact_no)}}>
											<option>OPTIONS</option>
											<option value="1">EDIT ACCOUNT INFO</option>
											<option value="2">EDIT PERSONAL INFO</option>
											<option value="3">CHANGE PASSWORD</option>
											<option value="4">DELETE</option>
										</select>
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
				<ToastContainer/>
			</div>
		</>
		);
};


const ChangePassword = () => {

	const navigate = useNavigate();

	const [data, setData] = useState({
		user_id: sessionStorage.getItem("pwd_user_id"),
		email: sessionStorage.getItem("pwd_email")
	  });

	const notify = (e) => toast(e);

	const changeHandler = (e) => {
		setData({ ...data, [e.target.name]: e.target.value });
	};


	const submitHandler = (e) => {
		e.preventDefault();

		axios.put("http://localhost:8080/warden/user/pwd/"+data.user_id, { headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")},data}).then((res) => {
			if(res.data === 'INVALID TOKEN' || res.data === 'NO TOKEN')
			{
				navigate("/");
				sessionStorage.clear();
			}
			else if(res.data === 'ACCESS DENIED')
			{
				navigate("/");
				sessionStorage.clear();
			}
			
			sessionStorage.removeItem("pwd_user_id");
			sessionStorage.removeItem("pwd_email");

			notify("PASSWORD EDITED SUCCESSFULLY");

			//navigate("/warden_dashboard/view_mess");
    });
	}


	return(
		<>
		<div className="main_content">
			<div className="header">Edit Password for - {data.email}  </div>
			<div className="info">
				<div className="container">
					
					<form onSubmit={submitHandler}>
						<label>New Password</label>
						<input type="password" id="password" name="password" onChange={changeHandler} required/>
						<br/><br/>

						<br/><br/>

						<button type="submit">Submit</button>
					</form>
				</div>
			</div>
				<ToastContainer/>
			</div>
		</>
		);
};



export {AddStudent, AddWarden, AddMess, ViewWardens, EditWarden, EditUser, ViewMess, EditMess, ViewStudents, EditStudent, ChangePassword};