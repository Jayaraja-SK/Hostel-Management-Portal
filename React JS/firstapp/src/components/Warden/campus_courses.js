import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';
import '../login.css'


const AddCampus = () => {

    const navigate = useNavigate();
	
	const notify = (e) => toast(e);
	
	const [data, setData] = useState({
		campus_name: "",
        campus_loc: ""
	  });

    const changeHandler = (e) => {
		setData({ ...data, [e.target.name]: e.target.value });
	};

	const submitHandler = (e) => {
		e.preventDefault();

		axios.post("http://localhost:8080/warden/campus", { headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")},data}).then((res) => {
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
		
			document.getElementById("add_campus").reset();
			notify("CAMPUS ADDED SUCCESSFULLY");
    });
	};

	return(
		<>
			<div className="main_content">
				<div className="header">Add Campus Details</div>
				<div className="info">
					<div className="container">
						<form id="add_campus" onSubmit={submitHandler}>

							<label>Name</label>
							<input type="text" id="campus_name" name="campus_name" onChange={changeHandler} required/>
							<br/><br/>
							
							<label>Location</label>
							<input type="text" id="campus_loc" name="campus_loc" onChange={changeHandler} required/>
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



const ViewCampus = () => {

	const navigate = useNavigate();

	const notify = (e) => toast(e);

	const [data, setData] = useState([]);

	var value;

	useEffect(() => {
		axios.get("http://localhost:8080/warden/campus",{ headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")}}).then((res) => {
			if(res.data.length === 0)
			{
				//notify("NO RECORDS FOUND");
			}
			
			setData(res.data);
		});

	});

	/*const editHandler = (id,name,loc) => {
		sessionStorage.setItem("campus_id",id);
		sessionStorage.setItem("campus_name",name);
		sessionStorage.setItem("campus_loc",loc);

		navigate("/warden_dashboard/edit_campus");

	}

	const deleteHandler = (id) => {
		axios.delete("http://localhost:8080/warden/campus/"+id, { headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")},data} ).then((res) => {

			window.location.reload();
		});
	}

	const viewCourses = (id,name,loc) => {
		sessionStorage.setItem("campus_id",id);
		sessionStorage.setItem("campus_name",name);
		sessionStorage.setItem("campus_loc",loc);

		navigate("/warden_dashboard/view_courses");
	}*/


	const changeHandler = (e) => {
		value = e.target.value;
	  };


	const setOption = (id,name,loc) => {
		if(value === '1')
		{
			sessionStorage.setItem("campus_id",id);
			sessionStorage.setItem("campus_name",name);
			sessionStorage.setItem("campus_loc",loc);

			navigate("/warden_dashboard/view_courses");
		}
		else if(value === '2')
		{
			sessionStorage.setItem("campus_id",id);
			sessionStorage.setItem("campus_name",name);
			sessionStorage.setItem("campus_loc",loc);

			navigate("/warden_dashboard/edit_campus");
		}
		else if(value === '3')
		{
			axios.delete("http://localhost:8080/warden/campus/"+id, { headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")},data} ).then((res) => {

				window.location.reload();
			});
		}
	}


	return(
		<>
			<div className="main_content">
				<div className="header fix">View Campus</div>
				<div className="info">
					<table>
						<thead>
							<tr>
								<th>Id</th>
								<th>Name</th>
								<th>Location</th>
							</tr>
						</thead>

						<tbody>
							{data && data.map(data =>
								<tr key={data.campus_id}>
									<td>{data.campus_id}</td>
									<td>{data.campus_name}</td>
									<td>{data.campus_loc}</td>
									{/* <td className="td-btn"><button onClick={() => viewCourses(data.campus_id, data.campus_name, data.campus_loc)}>VIEW COURSES</button></td>
									<td className="td-btn"><button onClick={() => editHandler(data.campus_id, data.campus_name, data.campus_loc)}>EDIT</button></td>
									<td className="td-btn"><button onClick={() => deleteHandler(data.campus_id)}>DELETE</button></td> */}
									<td>
										{/*<span className="td-btn"><button onClick={() => viewCourses(data.campus_id, data.campus_name, data.campus_loc)}>VIEW COURSES</button></span>
										<span className="td-btn"><button onClick={() => editHandler(data.campus_id, data.campus_name, data.campus_loc)}>EDIT</button>
											<button onClick={() => deleteHandler(data.campus_id)}>DELETE</button>
										</span>*/}

										<select name="options" id="options" onChange={(e) => {changeHandler(e);setOption(data.campus_id, data.campus_name, data.campus_loc)}}>
											<option>OPTIONS</option>
											<option value="1">VIEW COURSES</option>
											<option value="2">EDIT CAMPUS</option>
											<option value="3">DELETE CAMPUS</option>
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


const EditCampus = () => {

	const navigate = useNavigate();

	const [data, setData] = useState({
		campus_id: sessionStorage.getItem("campus_id"),
		campus_name: sessionStorage.getItem("campus_name"),
		campus_loc: sessionStorage.getItem("campus_loc")
	  });
	
	const changeHandler = (e) => {
		setData({ ...data, [e.target.name]: e.target.value });
	};

	const notify = (e) => toast(e);

	const submitHandler = (e) => {
		e.preventDefault();

		axios.put("http://localhost:8080/warden/campus/"+data.campus_id, { headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")},data} ).then((res) => {
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
			
			sessionStorage.removeItem("campus_id");
			sessionStorage.removeItem("campus_name");
			sessionStorage.removeItem("campus_loc");

			notify("CAMPUS DETAILS EDITED SUCCESSFULLY");

			navigate("/warden_dashboard/view_campus");
    });
	}

	return(
		<>
			<div className="main_content">
				<div className="header">Edit Campus Details</div>
				<div className="info">
					<div className="container">
						<form onSubmit={submitHandler}>
							<label>Campus Id</label>
							<input type="text" id="campus_id" name="campus_id" defaultValue={data.campus_id} disabled={true} />
							<br/><br/>

							<label>Campus Name</label>
							<input type="text" id="campus_name" name="campus_name" defaultValue={data.campus_name} onChange={changeHandler} />
							<br/><br/>

							<label>Campus Location</label>
							<input type="text" id="campus_loc" name="campus_loc" defaultValue={data.campus_loc} onChange={changeHandler} />
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


const AddCourse = () => {

    const navigate = useNavigate();

	const [campus, setCampus] = useState([]);

	const degree = [{id: 1, name: "BE"}, {id: 2, name: "B.Tech"}];

	const course = [{id: 1, name: "CSE"}, {id: 2, name: "IT"}, {id: 3, name: "ECE"}, {id: 4, name: "EEE"}, {id: 5, name: "Mech"}, {id: 7, name: "Civil"}, {id: 8, name: "BME"}, {id: 9, name: "Chemical"}];

	useEffect(() => {
		axios.get("http://localhost:8080/warden/campus", { headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")}} ).then((res) => {
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
		campus_id: null,
		degree: "",
		course_name: "",
		no_of_years: null
	  });

    const changeHandler = (e) => {
		setData({ ...data, [e.target.name]: e.target.value });
	};

    const notify = (e) => toast(e);

	const submitHandler = (e) => {
		e.preventDefault();

		axios.post("http://localhost:8080/warden/campus/"+data.campus_id+"/course", { headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")},data} ).then((res) => {
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
			
			document.getElementById("add_course").reset();
			notify("COURSE ADDED SUCCESSFULLY");
    });
	};

	return(
		<>
			<div className="main_content">
				<div className="header">Add Course Details</div>
				<div className="info">
					<div className="container">
						<form id="add_course" onSubmit={submitHandler}>
							<label>Campus</label>

							<select name="campus_id" id="campus_id" onChange={changeHandler} required>
								<option value="">Select Campus</option>
								{
									campus.map((campus,key) => {
										return <option key={key} value={campus.campus_id}>{campus.value}</option>;
									})
								}
							</select>
							<br/><br/>

							<label>Degree</label>
							<select name="degree" id="degree" onChange={changeHandler} required>
								<option value="">Select Degree</option>
								{
									degree.map((degree,key) => {
										return <option key={key} value={degree.name}>{degree.name}</option>;
									})
								}
							</select>
							<br/><br/>

							<label>Course Name</label>
							<select name="course_name" id="course_name" onChange={changeHandler} required>
								<option value="">Select Course</option> 
								{
									course.map((course,key) => {
										return <option key={key} value={course.name}>{course.name}</option>;
									})
								}
							</select>
							<br/><br/>

							<label>No of Years</label>
							<input type="number" id="no_of_years" name="no_of_years" onChange={changeHandler} min="1" max="6" required/>
		
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


const ViewCourses = () => {

	const navigate = useNavigate();

	const notify = (e) => toast(e);

	const [data, setData] = useState([]);

	var campus_name, campus_loc;

	var value;

	useEffect(() => {
		axios.get("http://localhost:8080/warden/campus/"+sessionStorage.getItem("campus_id")+"/courses", { headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")}} ).then((res) => {
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

	/*const editHandler = (id,degree,name,years) => {
		sessionStorage.setItem("course_id",id);
		sessionStorage.setItem("degree",degree);
		sessionStorage.setItem("course_name",name);
		sessionStorage.setItem("no_of_years",years);

		navigate("/warden_dashboard/edit_course");

	}

	const deleteHandler = (id) => {
		axios.delete("http://localhost:8080/warden/campus/"+sessionStorage.getItem("campus_id")+"/course/"+id, { headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")}} ).then((res) => {
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


	const setOption = (id,degree,name,years) => {
		if(value === '1')
		{
			sessionStorage.setItem("course_id",id);
			sessionStorage.setItem("degree",degree);
			sessionStorage.setItem("course_name",name);
			sessionStorage.setItem("no_of_years",years);

			navigate("/warden_dashboard/edit_course");
		}
		else if(value === '2')
		{
			axios.delete("http://localhost:8080/warden/campus/"+sessionStorage.getItem("campus_id")+"/course/"+id, { headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")}} ).then((res) => {
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


	campus_name = sessionStorage.getItem("campus_name");
	campus_loc = sessionStorage.getItem("campus_loc");


	return(
		<>
			<div className="main_content">
				<div className="header fix">Courses @ {campus_name} {campus_loc}</div>
				<div className="info">
					<table>
						<thead>
							<tr>
								<th>Id</th>
								<th>Degree</th>
								<th>Course Name</th>
								<th>Years</th>
							</tr>
						</thead>

						<tbody>
							{data && data.map(data =>
								<tr key={data.course_id}>
									<td>{data.course_id}</td>
									<td>{data.degree}</td>
									<td>{data.course_name}</td>
									<td>{data.no_of_years}</td>
									<td>
										{/*<span className="td-btn">
											<button onClick={() => editHandler(data.course_id, data.degree, data.course_name, data.no_of_years)}>EDIT</button>
											<button onClick={() => deleteHandler(data.course_id)}>DELETE</button>
										</span>*/}

										<select name="options" id="options" onChange={(e) => {changeHandler(e);setOption(data.course_id, data.degree, data.course_name, data.no_of_years)}}>
											<option>OPTIONS</option>
											<option value="1">EDIT COURSE</option>
											<option value="2">DELETE</option>
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


const EditCourse = () => {

	const navigate = useNavigate();

	const [data, setData] = useState({
		campus_id: sessionStorage.getItem("campus_id"),
		course_id: sessionStorage.getItem("course_id"),
		course_name: sessionStorage.getItem("course_name"),
		degree: sessionStorage.getItem("degree"),
		no_of_years: sessionStorage.getItem("no_of_years")
	  });
	
	const changeHandler = (e) => {
		setData({ ...data, [e.target.name]: e.target.value });
	};

	const notify = (e) => toast(e);

	const submitHandler = (e) => {
		e.preventDefault();

		axios.put("http://localhost:8080/warden/campus/"+data.campus_id+"/course/"+data.course_id, { headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")},data} ).then((res) => {
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
			
			sessionStorage.removeItem("course_id");
			sessionStorage.removeItem("course_name");
			sessionStorage.removeItem("degree");
			sessionStorage.removeItem("no_of_years");

			notify("DATA EDITED SUCCESSFULLY");

			navigate("/warden_dashboard/view_courses");
    });
	}

	return(
		<>
			<div className="main_content">
				<div className="header">Edit Course Details</div>
				<div className="info">
					<div className="container">
						<form onSubmit={submitHandler}>
							<label>Course Id</label>
							<input type="text" id="course_id" name="course_id" defaultValue={data.course_id} disabled={true} />
							<br/><br/>

							<label>Degree</label>
							<input type="text" id="degree" name="degree" defaultValue={data.degree} onChange={changeHandler} />
							<br/><br/>

							<label>Course Name</label>
							<input type="text" id="course_name" name="course_name" defaultValue={data.course_name} onChange={changeHandler} />
							<br/><br/>

							<label>No of Years</label>
							<input type="number" id="no_of_years" name="no_of_years" defaultValue={data.no_of_years} onChange={changeHandler} />
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






export {AddCampus, ViewCampus, EditCampus, AddCourse, ViewCourses, EditCourse};