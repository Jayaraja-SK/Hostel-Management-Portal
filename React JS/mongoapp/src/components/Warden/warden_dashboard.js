import React, { useEffect } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';
import '../login.css';



const WardenDashboard = () => {

	const navigate = useNavigate();

	useEffect(() => {
		axios.post("http://localhost:8080/warden/validate", { headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token"),'user-id': sessionStorage.getItem("user_id")}} ).then((res) => {
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
		});

	},[]);

	return(
		<>
			<div className="wrapper">
      			<div className="sidebar">
        			<h2>Warden Dashboard</h2>
					<Link to="/"><i id="logout-icon" title="Logout" className="fa fa-sign-out" onClick={() => {sessionStorage.clear();}}></i></Link>

					<ul>
						<li><Link to="/warden_dashboard/user/add_warden">Add Warden</Link></li>
						<li><Link to="/warden_dashboard/view_wardens">View Wardens</Link></li>
					</ul>
				</div>

				<Outlet />
			</div>
		</>
		);
};


export default WardenDashboard;