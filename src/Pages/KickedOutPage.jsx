import React from "react";
// Import the stars image correctly
import stars from "../assets/spark.svg"; // Adjust the path according to your folder structure
import "./KickedOutPage.css";
const KickedOutPage = () => {
  return (
    <div className="vh-100 d-flex justify-content-center align-items-center text-center kicked-out-container">
      <div>
        <span className="intervue-poll-badge">
          <img src={stars} alt="Poll Icon" /> Intervue Poll
        </span>
        <h1 className="fw-bold mt-3">You've been Kicked out !</h1>
        <p className="text-muted mt-2">
          Looks like the teacher has removed you from the poll system. Please
          try again sometime.
        </p>
      </div>
    </div>
  );
};

export default KickedOutPage;
