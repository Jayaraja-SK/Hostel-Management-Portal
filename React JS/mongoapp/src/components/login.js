import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';
import './login.css';


const Login = () => {
	const navigate = useNavigate();

	const notify = (e) => toast(e);
	
	const [data, setData] = useState({
		email: "",
		password: "",
	  });

	  /*if(sessionStorage.getItem("role") === 'WARDEN')
	  {
		  navigate("/warden_dashboard")
	  }*/

	useEffect(() => {
		if(sessionStorage.getItem("role") === 'WARDEN')
		{
			navigate("/warden_dashboard")
		}
		else if(sessionStorage.getItem("role") === 'SUBWARDEN')
		{
			navigate("/sub_warden_dashboard")
		}
		else if(sessionStorage.getItem("role") === 'MESS')
		{
			navigate("/mess_dashboard")
		}
		else if(sessionStorage.getItem("role") === 'STUDENT')
		{
			navigate("/student_dashboard")
		}

	},[]);
	
	const changeHandler = (e) => {
		setData({ ...data, [e.target.name]: e.target.value });
	};

	const submitHandler = (e) => {
		e.preventDefault();
		
		axios.post("http://localhost:8080/login", data).then((res) => {
			if(res.data.bool === false)
			{
				if(res.data.message === "INVALID EMAIL")
				{
					document.getElementById("email").value="";
					document.getElementById("password").value="";
					notify("INVALID EMAIL");
				}
				else
				{
					document.getElementById("password").value="";
					notify("INVALID PASSWORD");
				}
			}
			else
			{
				sessionStorage.setItem("email",data.email);
				sessionStorage.setItem("user_id",res.data.user_id);
				sessionStorage.setItem("token",res.data.token);
				sessionStorage.setItem("role",res.data.role);

				if(res.data.role === "WARDEN")
				{
					navigate("/warden_dashboard");
				}
				else if(res.data.role === "SUBWARDEN")
				{
					navigate("/sub_warden_dashboard");
				}
				else if(res.data.role === "STUDENT")
				{
					navigate("/student_dashboard");
				}
				else if(res.data.role === "MESS")
				{
					navigate("/mess_dashboard");
				}
			}
    });
	};

	return(
		<>
			<div className="login-box">
				<h2>HOSTEL MANAGEMENT PORTAL</h2>
				<h2>Login</h2>
				<form onSubmit={submitHandler}>
				
					<div className="user-box">
						<label>Email</label>
						<input type="email" id="email" name="email" onChange={changeHandler} required/>
					</div>
				
					<div className="user-box">
						<label>Password</label>
						<input type="password" id="password" name="password" onChange={changeHandler} required/>
					</div>
					<button type="submit">LOGIN</button>
				</form>
			</div>
			<ToastContainer/>
		</>
		);
};


export default Login;