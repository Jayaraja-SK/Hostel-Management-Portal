import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import {useNavigate } from "react-router-dom";
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';


function convertDateToUTC(date) {
	var d = new Date(date);
	return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
  }



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

		axios.post("http://localhost:8080/warden/user/warden", { headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token"),'user-id': sessionStorage.getItem("user_id")},data}).then((res) => {
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

		axios.put("http://localhost:8080/warden/user/"+data.user_id, { headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token"),'user-id': sessionStorage.getItem("user_id")},data}).then((res) => {
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

		axios.put("http://localhost:8080/warden/user/warden/"+data.user_id, { headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token"),'user-id': sessionStorage.getItem("user_id")},data}).then((res) => {
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





const ViewWardens = () => {

	const navigate = useNavigate();

	const notify = (e) => toast(e);

	const [data, setData] = useState([]);

	var value;

	useEffect(() => {
		axios.get("http://localhost:8080/warden/wardens", { headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token"),'user-id': sessionStorage.getItem("user_id")},data}).then((res) => {
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
			axios.delete("http://localhost:8080/warden/user/"+id, { headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token"),'user-id': sessionStorage.getItem("user_id")},data}).then((res) => {
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

		axios.put("http://localhost:8080/warden/user/pwd/"+data.user_id, { headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token"),'user-id': sessionStorage.getItem("user_id")},data}).then((res) => {
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



export { AddWarden, ViewWardens, EditWarden, EditUser, ChangePassword};