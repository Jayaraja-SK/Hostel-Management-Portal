import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";


const SubwardenChangePassword = () => {
    const navigate = useNavigate();
  
    const [data, setData] = useState({
      user_id: sessionStorage.getItem("user_id"),
      password: null,
      new_password: null,
      confirm_password: null
    });
  
    const changeHandler = (e) => {
      setData({ ...data, [e.target.name]: e.target.value });
    };
  
    const notify = (e) => toast(e);
  
    const submitHandler = (e) => {
      e.preventDefault();
      
        if(data.new_password!=data.confirm_password)
        {
            document.getElementById("new_password").value="";
            document.getElementById("confirm_password").value="";
            notify("NEW PASSWORDS ARE NOT MATCHING");
        }
        else
        {
            axios.put("http://localhost:8080/sub_warden/change_pwd/"+data.user_id, { headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")},data}).then((res) => {
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

            document.getElementById("change_pwd").reset();
    
            if(res.data === true)
            {
                notify("PASSWORD CHANGED SUCCESSFULLY");
            }
            else
            {
                notify("INVALID PASSWORD");
            }
            });
        }
    };
  
    return (
      <>
        <div className="main_content">
          <div className="header">Change Password</div>
          <div className="info">
            <div className="container">
              <form id="change_pwd" onSubmit={submitHandler}>
                <label>Current Password</label>
                <input type="password" id="password" name="password" onChange={changeHandler} required/>
                <br /><br />

                <label>New Password</label>
                <input type="password" id="new_password" name="new_password" onChange={changeHandler} required/>
                <br /><br />

                <label>Confirm New Password</label>
                <input type="password" id="confirm_password" name="confirm_password" onChange={changeHandler} required/>
                <br /><br />
  
                <button type="submit">Submit</button>
              </form>
            </div>
          </div>
          <ToastContainer />
        </div>
      </>
    );
  };


  export default SubwardenChangePassword ;
