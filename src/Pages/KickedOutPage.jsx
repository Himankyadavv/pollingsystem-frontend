import React from "react";
import { useNavigate } from "react-router-dom";

const KickedOutPage = () => {
  const navigate = useNavigate();

  return (
    <div className="vh-100 d-flex flex-column justify-content-center align-items-center">
      <h2>You have been kicked out of the poll</h2>
      <p>Please contact the teacher if you believe this was a mistake.</p>
      <button
        className="btn btn-primary mt-3"
        onClick={() => navigate("/")} // redirect to home
      >
        Go Home
      </button>
    </div>
  );
};

export default KickedOutPage;
