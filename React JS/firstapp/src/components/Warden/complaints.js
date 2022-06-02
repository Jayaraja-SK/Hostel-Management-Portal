import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

function convertDateToUTC(date) {
  var d = new Date(date);
  return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
}

const ViewAllComplaints = () => {
  const navigate = useNavigate();
  
  const notify = (e) => toast(e);

  const [data, setData] = useState([]);

  const [filter, setFilter] = useState({
    complaint_type: null,
    status: null,
    from_date: null,
    to_date: null,
  });

  const changeHandler = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const filterHandler = (e) => {
    e.preventDefault();

    axios.get("http://localhost:8080/warden/complaints/" +sessionStorage.getItem("user_id") +"/complaint_type=" +filter.complaint_type +"&&status=" +filter.status +"&&from_date=" +filter.from_date +"&&to_date=" +filter.to_date,{ headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")},data}).then((res) => {
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
  };

  return (
    <>
      <div className="main_content">
        <div className="header">View All Complaints</div>
        <div className="info">
          <div className="container">
            <form id="filter" onSubmit={filterHandler}>
              <label>Complaint Type</label>
              <select
                name="complaint_type"
                id="complaint_type"
                onChange={changeHandler}
                required
              >
                <option>Select Complaint Type</option>
                <option value="ELECTRICAL">ELECTRICAL</option>
                <option value="PLUMBING">PLUMBING</option>
                <option value="FURNITURE">FURNITURE</option>
                <option value="WIFI">WIFI</option>
              </select>
              <br />
              <br />

              <label>Status</label>
              <select
                name="status"
                id="status"
                onChange={changeHandler}
                required
              >
                <option>Select Status</option>
                <option value="RESOLVED">RESOLVED</option>
                <option value="NOT_RESOLVED">NOT RESOLVED</option>
              </select>
              <br />
              <br />

              <label>From Date</label>
              <input
                type="date"
                id="from_date"
                name="from_date"
                onChange={changeHandler}
              />
              <br />
              <br />

              <label>To Date</label>
              <input
                type="date"
                id="to_date"
                name="to_date"
                onChange={changeHandler}
              />
              <br />
              <br />

              <button type="submit">Filter</button>
            </form>
          </div>

          <table>
            <thead>
              <tr>
                <th>Complaint Id</th>
                <th>Student Name</th>
                <th>Campus Name</th>
                <th>Course Name</th>
                <th>Batch</th>
                <th>Room No.</th>
                <th>Contact No</th>
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
                    <td>{data.name}</td>
                    <td>{data.campus_name}</td>
                    <td>{data.course_name}</td>
                    <td>{data.batch}</td>
                    <td>{data.room_no}</td>
                    <td>{data.contact_no}</td>
                    <td>{data.complaint_date}</td>
                    <td>{data.complaint_type}</td>
                    <td>{data.complaint}</td>
                    <td>{data.status}</td>
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

export { ViewAllComplaints };
