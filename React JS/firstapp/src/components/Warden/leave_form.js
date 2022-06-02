import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";


function convertDateToUTC(date) {
	var d = new Date(date);
	return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
  }


const ViewAllLeaveForms = () => {
    const navigate = useNavigate();

    const notify = (e) => toast(e);

    const [data, setData] = useState([]);

    var new_status;

    const status = [
      { id: 1, name: "ACCEPTED" },
      { id: 2, name: "REJECTED" },
    ];

    useEffect(() => {
      axios.get("http://localhost:8080/warden/leave_forms/" +sessionStorage.getItem("user_id"),{ headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")},data}).then((res) => {
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
            res.data[i]["request_date"] = convertDateToUTC(res.data[i]["request_date"]);
            res.data[i]["from_date"] = convertDateToUTC(res.data[i]["from_date"]);
            res.data[i]["to_date"] = convertDateToUTC(res.data[i]["to_date"]);
          }
          
          setData(res.data);
        });
    });

    const changeHandler = (e) => {
      new_status = e.target.value;
    };

    const changeStatus = (id) => {
      axios.put("http://localhost:8080/warden/leave_forms/" +sessionStorage.getItem("user_id") +"/request_id=" +id +"&&status=" +new_status,{ headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")},data}).then((res) => {
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

    return (
      <>
        <div className="main_content">
          <div className="header fix">Displaying All Leave Requests...</div>
          <div className="info">
            <table>
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Student Name</th>
                  <th>Campus Name</th>
                  <th>Course Name</th>
                  <th>Batch</th>
                  <th>Contact No</th>
                  <th>Request Date</th>
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
                      <td>{data.name}</td>
                      <td>{data.campus_name}</td>
                      <td>{data.course_name}</td>
                      <td>{data.batch}</td>
                      <td>{data.contact_no}</td>
                      <td>{data.request_date}</td>
                      <td>{data.from_date}</td>
                      <td>{data.to_date}</td>
                      <td>{data.reason}</td>
                      <td>{data.status}</td>
                      <td>
                        <select
                          name="status"
                          id="status"
                          onChange={(e) => {
                            changeHandler(e);
                            changeStatus(data.request_id);
                          }}
                        >
                          <option>Change Status</option>
                          <option value="ACCEPTED">ACCEPT</option>
                          <option value="REJECTED">REJECT</option>
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

const ViewLeaveFormsByFilter = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);

  const [filter, setFilter] = useState({
    status: null,
    from_date: null,
    to_date: null,
  });

  var new_status;

  const status = [
    { id: 1, name: "ACCEPTED" },
    { id: 2, name: "REJECTED" },
  ];


  const changeHandler = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const changeStatus = (id) => {
    axios.put("http://localhost:8080/warden/leave_forms/" +sessionStorage.getItem("user_id") +"/request_id=" +id +"&&status=" +new_status,{ headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")},data})
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

        window.location.reload();
      });
  };

  const changeHandler1 = (e) => {
    new_status = e.target.value;
  };

  const filterHandler = (e) => {
    e.preventDefault();

    console.log(filter);

    axios.get("http://localhost:8080/warden/leave_forms/" +sessionStorage.getItem("user_id") +"/status=" +filter.status +"&&from_date=" +filter.from_date +"&&to_date=" +filter.to_date, { headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")},data})
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

        var i;

        for(i=0;i<res.data.length;i++)
        {
          res.data[i]["request_date"] = convertDateToUTC(res.data[i]["request_date"]);
          res.data[i]["from_date"] = convertDateToUTC(res.data[i]["from_date"]);
          res.data[i]["to_date"] = convertDateToUTC(res.data[i]["to_date"]);
        }

        setData(res.data);
      });
  };

  return (
    <>
      <div className="main_content">
        <div className="header">View Leave Forms</div>
        <div className="info">
          <div className="container">
            <form id="filter" onSubmit={filterHandler}>
              <label>Status</label>
              <select
                name="status"
                id="status"
                onChange={changeHandler}
                required
              >
                <option>Select Status</option>
                <option value="ACCEPTED">ACCEPTED</option>
                <option value="REJECTED">REJECTED</option>
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
                <th>Request ID</th>
                <th>Student Name</th>
                <th>Campus Name</th>
                <th>Course Name</th>
                <th>Batch</th>
                <th>Contact No</th>
                <th>Request Date</th>
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
                    <td>{data.name}</td>
                    <td>{data.campus_name}</td>
                    <td>{data.course_name}</td>
                    <td>{data.batch}</td>
                    <td>{data.contact_no}</td>
                    <td>{data.request_date}</td>
                    <td>{data.from_date}</td>
                    <td>{data.to_date}</td>
                    <td>{data.reason}</td>
                    <td>{data.status}</td>
                    <td>
                      <select
                        name="status"
                        id="status"
                        onChange={(e) => {
                          changeHandler1(e);
                          changeStatus(data.request_id);
                        }}
                      >
                        <option>Change Status</option>
                        <option value="ACCEPTED">ACCEPT</option>
                        <option value="REJECTED">REJECT</option>
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

export { ViewAllLeaveForms, ViewLeaveFormsByFilter };
