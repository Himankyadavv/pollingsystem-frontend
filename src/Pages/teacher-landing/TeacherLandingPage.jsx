import React, { useState } from "react";
import stars from "../../assets/spark.svg";
import "./TeacherLandingPage.css";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import eyeIcon from "../../assets/eye.svg";

let apiUrl = "https://pollingsystem-backend-6qbs.onrender.com";
const socket = io(apiUrl);

const TeacherLandingPage = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([
    { id: 1, text: "", correct: null },
    { id: 2, text: "", correct: null },
  ]);
  const [timer, setTimer] = useState("60");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const username = sessionStorage.getItem("username");

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleTimerChange = (e) => {
    setTimer(e.target.value);
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index].text = value;
    setOptions(updatedOptions);
  };

  const handleCorrectToggle = (index, isCorrect) => {
    const updatedOptions = [...options];
    updatedOptions[index].correct = isCorrect;
    setOptions(updatedOptions);
  };

  const addOption = () => {
    setOptions([
      ...options,
      { id: options.length + 1, text: "", correct: null },
    ]);
  };

  const validateForm = () => {
    if (question.trim() === "") {
      setError("Question cannot be empty");
      return false;
    }

    if (options.length < 2) {
      setError("At least two options are required");
      return false;
    }

    const optionTexts = options.map((option) => option.text.trim());
    if (optionTexts.some((text) => text === "")) {
      setError("All options must have text");
      return false;
    }

    const correctOptionExists = options.some(
      (option) => option.correct === true
    );
    if (!correctOptionExists) {
      setError("At least one correct option must be selected");
      return false;
    }

    setError("");
    return true;
  };

  const askQuestion = () => {
    if (validateForm()) {
      let teacherUsername = sessionStorage.getItem("username");
      let pollData = { question, options, timer, teacherUsername };
      socket.emit("createPoll", pollData);
      navigate("/teacher-poll");
    }
  };

  const handleViewPollHistory = () => {
    navigate("/teacher-poll-history");
  };

  return (
    <div className="teacher-page-wrapper">
      <div className="notes" style={{display:"flex", flexdirection:"row", justifyContent:"center", alignItems:"center", color:"black"}}>
        
         {/* <marquee  direction="right" scrollamount="15" style={{display:"flex", flexdirection:"row"}} >
            <p style={{color: "red", alignContent:"center", font:"bold"}}>DISCLAIMER</p>
            <p>In order for this application to work you should also access the application as a <b><strong>STUDENT</strong></b> on the other device</p>
         </marquee> */}
         <marquee  direction="right" scrollamount="15" style={{display:"flex", flexdirection:"row", justifyContent:"space-between", fontSize:"20px",paddingTop:"10px"}} >
            {/* <p style={{color: "red", alignContent:"center", font:"bold", margin:"10px"}}><b>DISCLAIMER</b></p> */}
            <p style={{margin:"10px 0px", fontSize:"25px"}}><span><b style={{color: "red"}}>DISCLAIMER: </b></span> In order for this application to work you should also access the application as a <b><strong>STUDENT</strong></b> on the other device</p>
         </marquee>
      </div>
     
      <div className="poll-creation-container">
        <div className="header-actions">
          <button className="btn btn-sm intervue-btn mb-3">
            <img src={stars} alt="Poll Icon" /> Intervue Poll
          </button>
          <button
            className="btn rounded-pill view-history-btn px-4"
            onClick={handleViewPollHistory}
          >
            <img src={eyeIcon} alt="" />
            
          </button>
        </div>

        <h2 className="fw-bold">Let's Get Started</h2>
        <p className="text-muted">
          You'll have the ability to create and manage polls, ask questions, and
          monitor your students' responses in real-time.
        </p>

        {error && <div className="alert alert-danger mt-3">{error}</div>}

        <div className="mb-4 mt-4">
          <div className="d-flex justify-content-between align-items-center pb-2">
            <label
              htmlFor="question"
              className="form-label fw-bold fs-5 text-nowrap"
            >
              Enter your question
            </label>

            {/* make select compact and give it a small left margin */}
            <select
              className="form-select w-auto ms-3 timer-dropdown"
              style={{ width: 140 }} // adjust px to taste
              value={timer}
              onChange={handleTimerChange}
            >
              <option value="60">60 seconds</option>
              <option value="30">30 seconds</option>
              <option value="90">90 seconds</option>
            </select>
          </div>

          {/* Changed input to textarea for a bigger input box */}
          <textarea
            id="question"
            className="form-control"
            onChange={handleQuestionChange}
            rows="3"
            maxLength="100"
            value={question}
          ></textarea>
          <div className="text-end text-muted mt-1 small">
            {question.length}/100
          </div>
        </div>

        <div className="mb-4">
          {/* HEADER ROW */}
          <div className="d-flex justify-content-between pb-3">
            <label className="form-label fw-bold fs-5">Edit Options</label>
            {/* Added a new class for precise alignment */}
            <label className="form-label fw-bold fs-5 is-correct-header">
              Is it Correct?
            </label>
          </div>

          {/* DYNAMIC OPTION ROWS */}
          {options.map((option, index) => (
            <div key={option.id} className="d-flex align-items-center mb-3">
              <span className="me-3 sNo">{index + 1}</span>
              <input
                type="text"
                // The input now grows to fill space instead of having a fixed width percentage
                className="form-control form-control-lg me-3 option-input flex-grow-1"
                value={option.text}
                onChange={(e) => handleOptionChange(index, e.target.value)}
              />

              {/* This new wrapper groups the radio buttons into a single column */}
              <div className="correct-answer-group">
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name={`correct-${option.id}`}
                    checked={option.correct === true}
                    onChange={() => handleCorrectToggle(index, true)}
                  />
                  <label className="form-check-label">Yes</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name={`correct-${option.id}`}
                    checked={option.correct === false}
                    onChange={() => handleCorrectToggle(index, false)}
                  />
                  <label className="form-check-label">No</label>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="btn add-options" onClick={addOption}>
          + Add More option
        </button>
      </div>

      <div className="footer-actions">
        <button
          className="btn rounded-pill ask-question px-4"
          onClick={askQuestion}
        >
          Ask Question
        </button>
      </div>
    </div>
  );
};

export default TeacherLandingPage;
