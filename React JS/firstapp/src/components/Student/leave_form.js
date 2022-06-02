import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

import fileDownload from 'js-file-download'


function convertDateToUTC(date) {
	var d = new Date(date);
	return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
  }


const ViewLeaveFormsStudent = () => {
  const navigate = useNavigate();

  const notify = (e) => toast(e);

  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/student/leave_forms/" +sessionStorage.getItem("user_id"),{ headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")},data}).then((res) => {
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
          res.data[i]["request_date"] = convertDateToUTC(res.data[i]["request_date"]);
          res.data[i]["from_date"] = convertDateToUTC(res.data[i]["from_date"]);
          res.data[i]["to_date"] = convertDateToUTC(res.data[i]["to_date"]);

          if(res.data[i]["status"] === "ACCEPTED")
          {
            res.data[i]["button"] = "";
          }
          else
          {
            res.data[i]["button"] = "none";
          }
        }

        setData(res.data);
      });
  });


  const downloadHandler = (id) => {

    axios.get("http://localhost:8080/student/get_leave_form_file/"+id, { headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")}, responseType: "blob" }).then(res => {
          const file = new Blob([res.data], {type: "application/pdf"});
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL);

            document.getElementById("button-1-"+id).style.display='';
            document.getElementById("button-2-"+id).style.display='none';
      });

  }


  const generateHandler = (id) => {

    const temp = {request_id: id, user_id: sessionStorage.getItem("user_id")}

    axios.post("http://localhost:8080/student/add_leave_form_file",{ headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")}, temp}).then((res) => {
        document.getElementById("button-1-"+id).style.display='none';
        document.getElementById("button-2-"+id).style.display='';

    });
  }

  return (
    <>
      <br />
      <br />
      <div className="main_content">
        <div className="header fix">Displaying All Leave Requests...</div>
        <div className="info">
          <table>
            <thead>
              <tr>
                <th>Request ID</th>
                <th>From Date</th>
                <th>To Date</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {data &&
                data.map((data) => (
                  <tr key={data.request_id}>
                    <td>{data.request_id}</td>
                    <td>{data.from_date}</td>
                    <td>{data.to_date}</td>
                    <td>{data.reason}</td>
                    <td>{data.status}</td>
                    <td>
                      <span>
                        <button id={"button-1-"+data.request_id} style={{display:data.button}} onClick={() => generateHandler(data.request_id)}>GENERATE PDF</button>
                        <button id={"button-2-"+data.request_id} style={{display:'none'}} onClick={() => downloadHandler(data.request_id)}>DOWNLOAD</button>
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

const AddLeaveForms = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    student_id: sessionStorage.getItem("user_id"),
    from_date: null,
    to_date: null,
    reason: null,
  });

  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const notify = (e) => toast(e);

  const submitHandler = (e) => {
    e.preventDefault();

    var request_date = new Date(Date.now()).getFullYear() + "-" + (new Date(Date.now()).getMonth() + 1) + "-" + new Date(Date.now()).getDate();

    if(new Date(data.from_date)>new Date(data.to_date))
    {
        notify("START DATE IS GREATER THAN END DATE");
    }
    else if(new Date(request_date)>new Date(data.from_date))
    {
      notify("CURRENT DATE IS GREATER THAN START DATE")
    }
    else
    {
      axios.post("http://localhost:8080/student/leave_form", { headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")},data}).then((res) => {
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
        
        document.getElementById("leave_form").reset();
        notify("REQUEST SENT SUCCESSFULLY");
      });
    }
  };

  return (
    <>
      <div className="main_content">
        <div className="header">Leave Request Form</div>
        <div className="info">
          <div className="container">
            <form id="leave_form" onSubmit={submitHandler}>
              <label>From Date</label>
              <input
                type="date"
                id="from_date"
                name="from_date"
                onChange={changeHandler}
                required
              />
              <br />
              <br />

              <label>To Date</label>
              <input
                type="date"
                id="to_date"
                name="to_date"
                onChange={changeHandler}
                required
              />
              <br />
              <br />

              <label>Reason</label>
              <textarea type="text"
                id="reason"
                name="reason"
                onChange={changeHandler}
                required
              />
              <br />
              <br />
              <br />
              <br />

              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export { ViewLeaveFormsStudent, AddLeaveForms };
