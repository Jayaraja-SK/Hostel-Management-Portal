import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";


function convertDateToUTC(date) {
	var d = new Date(date);
	return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
  }


const AddComplaint = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    student_id: sessionStorage.getItem("user_id"),
    complaint_type: null,
    complaint: null,
  });

  const complaint_type = [
    { id: 1, name: "ELECTRICAL" },
    { id: 2, name: "FURNITURE" },
    { id: 3, name: "PLUMBING" },
    { id: 4, name: "WIFI" },
  ];

  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const notify = (e) => toast(e);

  const submitHandler = (e) => {
    e.preventDefault();
    

    axios.post("http://localhost:8080/student/complaint_reg", { headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")},data}).then((res) => {
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

        document.getElementById("complaint_reg").reset();
        notify("COMPLAINT REGISTERED SUCCESSFULLY");
      });
  };

  return (
    <>
      <div className="main_content">
        <div className="header">Complaint Registration</div>
        <div className="info">
          <div className="container">
            <form id="complaint_reg" onSubmit={submitHandler}>
              <label>Complaint Type</label>
              <select
                name="complaint_type"
                id="complaint_type"
                onChange={changeHandler}
                required
              >
                <option value="">Select Complaint Type</option>
                {complaint_type.map((complaint_type, key) => {
                  return (
                    <option key={key} value={complaint_type.name}>
                      {complaint_type.name}
                    </option>
                  );
                })}
              </select>
              <br />
              <br />

              <label>Description</label>
              <input
                type="text"
                id="complaint"
                name="complaint"
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

const ViewComplaintsStudent = () => {
  const navigate = useNavigate();

  const notify = (e) => toast(e);

  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/student/complaints/" +sessionStorage.getItem("user_id"),{ headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")},data})
      .then((res) => {
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
          res.data[i]["complaint_date"] = convertDateToUTC(res.data[i]["complaint_date"]);
        }

        setData(res.data);
      });
  });

  var new_status;

  const changeStatus = (id) => {
    axios.put("http://localhost:8080/student/complaint/complaint_id=" +id +"&&status=" +new_status,{ headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")},data}).then((res) => {
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
  };

  const changeHandler1 = (e) => {
    new_status = e.target.value;
  };

  return (
    <>
      <div className="main_content">
        <div className="header fix">Displaying All Complaints</div>
        <div className="info">
          <table>
            <thead>
              <tr>
                <th>Complaint ID</th>
                <th>Complaint Date</th>
                <th>Complaint Type</th>
                <th>Complaint</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {data &&
                data.map((data) => (
                  <tr key={data.complaint_id}>
                    <td>{data.complaint_id}</td>
                    <td>{data.complaint_date}</td>
                    <td>{data.complaint_type}</td>
                    <td>{data.complaint}</td>
                    <td>{data.status}</td>
                    <td>
                      <select
                        name="status"
                        id="status"
                        onChange={(e) => {
                          changeHandler1(e);
                          changeStatus(data.complaint_id);
                        }}
                      >
                        <option>Change Status</option>
                        <option value="RESOLVED">RESOLVED</option>
                        <option value="NOT_RESOLVED">NOT RESOLVED</option>
                      </select>
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

export { AddComplaint, ViewComplaintsStudent };
