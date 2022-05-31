import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';
import './login.css';



const Logout = () => {
	const navigate = useNavigate();
	
	const [data, setData] = useState({
		email: "",
		password: "",
	  });
	
	const changeHandler = (e) => {
		setData({ ...data, [e.target.name]: e.target.value });
	};

	const notify = (e) => toast(e);

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
			<div class="login-box">
				<h2>HOSTEL MANAGEMENT PORTAL</h2>
				<h2>Login</h2>
				<form onSubmit={submitHandler}>
				
					<div class="user-box">
						<label for="email">Email</label>
						<input type="email" id="email" name="email" onChange={changeHandler} />
					</div>
				
					<div class="user-box">
						<label for="password">Password</label>
						<input type="password" id="password" name="password" onChange={changeHandler} />
					</div>
					<button type="submit">LOGIN</button>
				</form>

				<ToastContainer/>
			</div>
		</>
		);
};


export default Logout;