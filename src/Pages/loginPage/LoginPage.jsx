import React, { useState } from "react";
import stars from "../../assets/spark.svg";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
let apiUrl = "https://pollingsystem-backend-6qbs.onrender.com";
const LoginPage = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();
  const selectRole = (role) => {
    setSelectedRole(role);
  };

  const continueToPoll = async () => {
    if (selectedRole === "teacher") {
      let teacherlogin = await axios.post(`${apiUrl}/teacher-login`);
      sessionStorage.setItem("username", teacherlogin.data.username);
      navigate("/teacher-home-page");
    } else if (selectedRole === "student") {
      navigate("/student-home-page");
    } else {
      alert("Please select a role.");
    }
  };

  return (
    <div className="d-flex justify-content-center flex-column align-items-center vh-100">
      <div className="notes" style={{display:"flex", flexdirection:"row", justifyContent:"center", alignItems:"center", color:"black", position:"absolute", top:"10px"}}>
        
         {/* <marquee  direction="right" scrollamount="15" style={{display:"flex", flexdirection:"row"}} >
            <p style={{color: "red", alignContent:"center", font:"bold"}}>DISCLAIMER</p>
            <p>In order for this application to work you should also access the application as a <b><strong>STUDENT</strong></b> on the other device</p>
         </marquee> */}
         <div  direction="right" scrollamount="15" style={{display:"flex", flexdirection:"row", justifyContent:"space-between", fontSize:"20px",paddingTop:"10px"}} >
            {/* <p style={{color: "red", alignContent:"center", font:"bold", margin:"10px"}}><b>DISCLAIMER</b></p> */}
            <p style={{margin:"10px 0px", fontSize:"25px"}}><span><b style={{color: "red"}}>DISCLAIMER: </b></span> In order for this application to work you should also access the application as a <b><strong>TEACHER</strong></b> on the other device</p>
         </div>
      </div>
      <div className="poll-container text-center">
        <button className="btn btn-sm intervue-btn mb-5">
          <img src={stars} className="px-1" alt="" />
          Intervue Poll
        </button>
        <h3 className="poll-title">
          Welcome to the <b>Live Polling System</b>
        </h3>
        <p className="poll-description">
          Please select the role that best describes you to begin using the live
          polling system
        </p>

        <div className="d-flex justify-content-around mb-4">
          <div
            className={`role-btn ${selectedRole === "student" ? "active" : ""}`}
            onClick={() => selectRole("student")}
          >
            <p>I'm a Student</p>
            <span>
              Be the one to answer the poll correctly and win exciting prizes!
            </span>
          </div>
          <div
            className={`role-btn ${selectedRole === "teacher" ? "active" : ""}`}
            onClick={() => selectRole("teacher")}
          >
            <p>I'm a Teacher</p>
            <span>Create the poll for the students and asks for interesting opinions.</span>
          </div>
        </div>

        <button className="btn continue-btn" onClick={continueToPoll}>
          Continue
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
