import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";


function convertDateToUTC(date) {
	var d = new Date(date);
	return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
  }


const ViewBillCancellationByFilter = () => {
  const navigate = useNavigate();

  const notify = (e) => toast(e);

  const [data, setData] = useState([]);

  const [filter, setFilter] = useState({
    from_date: null,
    to_date: null,
  });

  const changeHandler = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const filterHandler = (e) => {
    e.preventDefault();

    axios.get("http://localhost:8080/mess/bill_cancellations/" +sessionStorage.getItem("user_id") +"/from_date=" +filter.from_date +"&&to_date=" +filter.to_date,{ headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")},data})
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

        for (i = 0; i < res.data.length; i++) {
          res.data[i]["id"] = i + 1;
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
        <div className="header">View Bill Cancellation By Filter</div>
        <div className="info">
          <div className="container">
            <form id="filter" onSubmit={filterHandler}>
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
              <br />
              <br />

              <button type="submit">Filter</button>
            </form>
          </div>
          <table>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Student Name</th>
                <th>Campus Name</th>
                <th>Course Name</th>
                <th>Batch</th>
                <th>Contact No</th>
                <th>Request Date</th>
                <th>From Date</th>
                <th>To Date</th>
              </tr>
            </thead>

            <tbody>
              {data &&
                data.map((data) => (
                  <tr key={data.id}>
                    <td>{data.id}</td>
                    <td>{data.name}</td>
                    <td>{data.campus_name}</td>
                    <td>{data.course_name}</td>
                    <td>{data.batch}</td>
                    <td>{data.contact_no}</td>
                    <td>{data.request_date}</td>
                    <td>{data.from_date}</td>
                    <td>{data.to_date}</td>
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

const ViewStudentsList = () => {
  const navigate = useNavigate();

  const notify = (e) => toast(e);

  const [data, setData] = useState([]);

  const [campus, setCampus] = useState([]);

  const [courses, setCourses] = useState([]);

  const [filter, setFilter] = useState({
    campus_id: null,
    course_id: null,
    batch: null,
  });

  useEffect(() => {
    axios.get("http://localhost:8080/mess/campus/"+sessionStorage.getItem("user_id"), { headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")},data}).then((res) => {
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

      for (i = 0; i < res.data.length; i++) {
        res.data[i]["value"] =
          res.data[i].campus_name + " " + res.data[i].campus_loc;

        delete res.data[i]["campus_name"];
        delete res.data[i]["campus_loc"];
      }

      setCampus(res.data);
    });
  });

  const changeHandler = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const getCourses = () => {
    axios.get("http://localhost:8080/mess/campus/" +document.getElementById("campus_id").value +"/courses",{ headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")},data})
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

        for (i = 0; i < res.data.length; i++) {
          res.data[i]["value"] =
            res.data[i].degree + " " + res.data[i].course_name;

          delete res.data[i]["course_name"];
          delete res.data[i]["degree"];
          delete res.data[i]["no_of_years"];
        }

        setCourses(res.data);
      });
  };

  const filterHandler = (e) => {
    e.preventDefault();

    axios.get("http://localhost:8080/mess/students_list/" +sessionStorage.getItem("user_id") +"/campus_id=" +filter.campus_id +"&&course_id=" +filter.course_id +"&&batch=" +filter.batch,{ headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")},data})
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


        //document.getElementById("filter").reset();
        setData(res.data);
      });
  };

  const infoHandler = (
    id,
    name,
    contact_no,
    campus_name,
    course_name,
    batch
  ) => {
    sessionStorage.setItem("mess_student_id", id);
    sessionStorage.setItem("mess_student_name", name);
    sessionStorage.setItem("mess_contact_no", contact_no);
    sessionStorage.setItem("mess_campus_name", campus_name);
    sessionStorage.setItem("mess_course_name", course_name);
    sessionStorage.setItem("mess_batch", batch);
    navigate("/mess_dashboard/student_bill_cancellations");
  };

  return (
    <>
      <div className="main_content">
        <div className="header">Complaint Registration</div>
        <div className="info">
          <div className="container">
            <form id="filter" onSubmit={filterHandler}>
              <label>Campus</label>
              <select
                name="campus_id"
                id="campus_id"
                onChange={(e) => {
                  changeHandler(e);
                  getCourses();
                }}
                required
              >
                <option value="">Select Campus</option>
                {campus.map((campus, key) => {
                  return (
                    <option key={key} value={campus.campus_id}>
                      {campus.value}
                    </option>
                  );
                })}
              </select>
              <br />
              <br />

              <label>Course</label>
              <select
                name="course_id"
                id="course_id"
                onChange={changeHandler}
                required
              >
                <option value="">Select Course</option>
                {courses.map((courses, key) => {
                  return (
                    <option key={key} value={courses.course_id}>
                      {courses.value}
                    </option>
                  );
                })}
              </select>
              <br />
              <br />

              <label>Batch</label>
              <input
                type="number"
                id="batch"
                name="batch"
                defaultValue={data.company_loc}
                onChange={changeHandler}
                required
              />
              <br />
              <br />
              <br />
              <br />

              <button type="submit">FILTER</button>
            </form>
          </div>
          <table>
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Campus Name</th>
                <th>Course Name</th>
                <th>Batch</th>
                <th>Room No</th>
              </tr>
            </thead>

            <tbody>
              {data &&
                data.map((data) => (
                  <tr key={data.student_id}>
                    <td>{data.student_id}</td>
                    <td>{data.name}</td>
                    <td>{data.campus_name}</td>
                    <td>{data.course_name}</td>
                    <td>{data.batch}</td>
                    <td>{data.room_no}</td>
                    <td>
                      <span>
                      <button
                        onClick={() =>
                          infoHandler(
                            data.student_id,
                            data.name,
                            data.contact_no,
                            data.campus_name,
                            data.course_name,
                            data.batch
                          )
                        }
                      >
                        View Cancellations
                      </button>
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

const ViewStudentBillCancellations = () => {
  const navigate = useNavigate();

  const notify = (e) => toast(e);

  const [data, setData] = useState([]);

  const [info, setInfo] = useState({
    name: sessionStorage.getItem("mess_student_name"),
    campus_name: sessionStorage.getItem("mess_campus_name"),
    course_name: sessionStorage.getItem("mess_course_name"),
    batch: sessionStorage.getItem("mess_batch"),
    contact_no: sessionStorage.getItem("mess_contact_no"),
  });

  useEffect(() => {
    axios.get("http://localhost:8080/mess/bill_cancellations_student/" +sessionStorage.getItem("user_id") +"/" +sessionStorage.getItem("mess_student_id"),{ headers: {'Content-Type': 'application/json','x-auth-header': sessionStorage.getItem("token")},data})
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

        console.log(res.data)

        var i;

        for (i = 0; i < res.data.length; i++) {
          res.data[i]["id"] = i + 1;
          res.data[i]["request_date"] = convertDateToUTC(res.data[i]["request_date"]);
          res.data[i]["from_date"] = convertDateToUTC(res.data[i]["from_date"]);
          res.data[i]["to_date"] = convertDateToUTC(res.data[i]["to_date"]);
        }

        setData(res.data);
      });
  }, []);

  return (
    <>
      <br />
      <br />
      <div className="main_content">
      <div className="header fix">Bill Cancellations of {info.name} [ {info.campus_name} {info.course_name} {info.batch} - {info.contact_no} ]</div>
      <div className="info">
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Request Date</th>
              <th>From Date</th>
              <th>To Date</th>
            </tr>
          </thead>

          <tbody>
            {data &&
              data.map((data) => (
                <tr key={data.id}>
                  <td>{data.id}</td>
                  <td>{data.request_date}</td>
                  <td>{data.from_date}</td>
                  <td>{data.to_date}</td>
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

export {ViewBillCancellationByFilter,ViewStudentsList,ViewStudentBillCancellations};
