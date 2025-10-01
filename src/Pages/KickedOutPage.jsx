import React from "react";

 // Assuming the spark icon is in this path

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
          Try again sometime.
        </p>
      </div>
    </div>
  );
};

export default KickedOutPage;
