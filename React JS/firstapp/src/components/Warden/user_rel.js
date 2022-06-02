import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import {useNavigate } from "react-router-dom";
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';


const AddWardenStudentRel = () => {

    const navigate = useNavigate();

	const [campus, setCampus] = useState([]);

	const [wardens, setWardens] = useState([]);

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


        axios.get("http://localhost:8080/warden/wardens",{ headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")},data}).then((res) => {
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
				res.data[i]["value"]=res.data[i].name+" "+res.data[i].contact_no;
			}

			setWardens(res.data);
		});

	});
	
	const [data, setData] = useState({
		warden_id: null,
        campus_id: null,
        batch: null
	  });

    const changeHandler = (e) => {
		setData({ ...data, [e.target.name]: e.target.value });
	};


    const notify = (e) => toast(e);

	const submitHandler = (e) => {
		e.preventDefault();

		axios.post("http://localhost:8080/warden/warden_student", { headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")},data}).then((res) => {
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
                document.getElementById("add_warden_student_rel").reset();
			    notify("WARDEN <---> STUDENT ADDED SUCCESSFULLY");
            }
            else
            {
                document.getElementById("add_warden_student_rel").reset();
			    notify("RELATION ALREADY EXISTS");
            }
    });
	};

	return(
		<>
			<div className="main_content">
				<div className="header">Add Warden Student Relationship</div>
				<div className="info">
					<div className="container">
						<form id="add_warden_student_rel" onSubmit={submitHandler}>
							<label>Warden</label>
							<select name="warden_id" id="warden_id" onChange={changeHandler} required>
								<option value="">Select Warden</option> 
								{
									wardens.map((wardens,key) => {
										return <option key={key} value={wardens.user_id}>{wardens.value}</option>;
									})
								}
							</select>
							<br/><br/>

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

							<label>Batch</label>
							<input type="number" id="batch" name="batch" onChange={changeHandler} defaultValue={data.batch} required/>
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


const ViewWardenStudentRel = () => {

	const navigate = useNavigate();

	const notify = (e) => toast(e);

	const [data, setData] = useState([]);

	useEffect(() => {
		axios.get("http://localhost:8080/warden/warden_student_rel",{ headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")},data}).then((res) => {
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
                res.data[i]["id"]=i;
            }

			setData(res.data);
		});

	});

	const deleteHandler = (warden_id,campus_id,batch) => {
        axios.delete("http://localhost:8080/warden/warden_student/warden_id="+warden_id+"&&campus_id="+campus_id+"&&batch="+batch,{ headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")},data}).then((res) => {
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


	return(
		<>
			<div className="main_content">
				<div className="header fix">Warden Student Relationship</div>
				<div className="info">
					<table>
						<thead>
							<tr>
								<th>Warden Id</th>
								<th>Warden Name</th>
								<th>Campus Id</th>
								<th>Campus Name</th>
								<th>Campus Location</th>
								<th>Batch</th>
							</tr>
						</thead>

						<tbody>
							{data && data.map(data =>
								<tr key={data.id}>
									<td>{data.warden_id}</td>
									<td>{data.name}</td>
									<td>{data.campus_id}</td>
									<td>{data.campus_name}</td>
									<td>{data.campus_loc}</td>
									<td>{data.batch}</td>
									<td>
										<span>
											<button onClick={() => deleteHandler(data.warden_id,data.campus_id,data.batch)}>DELETE</button>
										</span>
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


const AddMessStudentRel = () => {

    const navigate = useNavigate();

	const [campus, setCampus] = useState([]);

	const [mess, setMess] = useState([]);
	

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

			var i;

			for(i=0;i<res.data.length;i++)
			{
				res.data[i]["value"]=res.data[i].name+" "+res.data[i].contact_no;
			}

			setMess(res.data);
		});

	});
	
	const [data, setData] = useState({
		mess_id: null,
        campus_id: null,
        batch: null
	  });

    const changeHandler = (e) => {
		setData({ ...data, [e.target.name]: e.target.value });
	};


    const notify = (e) => toast(e);

	const submitHandler = (e) => {
		e.preventDefault();

		axios.post("http://localhost:8080/warden/mess_student", { headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")},data}).then((res) => {
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
                document.getElementById("add_mess_student_rel").reset();
			    notify("MESS <---> STUDENT ADDED SUCCESSFULLY");
            }
            else
            {
                document.getElementById("add_mess_student_rel").reset();
			    notify("RELATION ALREADY EXISTS");
            }
    });
	};

	return(
		<>
			<div className="main_content">
				<div className="header">Add Mess Student Relationship</div>
				<div className="info">
					<div className="container">
						<form id="add_mess_student_rel" onSubmit={submitHandler}>
							<label>Mess</label>
							<select name="mess_id" id="mess_id" onChange={changeHandler} required>
								<option value="">Select Mess</option> 
								{
									mess.map((mess,key) => {
										return <option key={key} value={mess.user_id}>{mess.value}</option>;
									})
								}
							</select>
							<br/><br/>

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

							<label>Batch</label>
							<input type="number" id="batch" name="batch" onChange={changeHandler} defaultValue={data.batch} required/>
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


const ViewMessStudentRel = () => {

	const navigate = useNavigate();

	const notify = (e) => toast(e);

	const [data, setData] = useState([]);

	useEffect(() => {
		axios.get("http://localhost:8080/warden/mess_student_rel", { headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")},data}).then((res) => {
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
                res.data[i]["id"]=i;
            }

			setData(res.data);
		});

	});

	const deleteHandler = (mess_id,campus_id,batch) => {
        axios.delete("http://localhost:8080/warden/mess_student/mess_id="+mess_id+"&&campus_id="+campus_id+"&&batch="+batch, { headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")},data}).then((res) => {
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


	return(
		<>
			<div className="main_content">
				<div className="header fix">Mess Student Relationship</div>
				<div className="info">
					<table>
						<thead>
							<tr>
								<th>Mess Id</th>
								<th>Mess Name</th>
								<th>Campus Id</th>
								<th>Campus Name</th>
								<th>Campus Location</th>
								<th>Batch</th>
							</tr>
						</thead>

						<tbody>
							{data && data.map(data =>
								<tr key={data.id}>
									<td>{data.mess_id}</td>
									<td>{data.name}</td>
									<td>{data.campus_id}</td>
									<td>{data.campus_name}</td>
									<td>{data.campus_loc}</td>
									<td>{data.batch}</td>
									<td>
										<span>
											<button onClick={() => deleteHandler(data.mess_id,data.campus_id,data.batch)}>DELETE</button>
										</span>
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


export {AddWardenStudentRel, ViewWardenStudentRel, AddMessStudentRel, ViewMessStudentRel};