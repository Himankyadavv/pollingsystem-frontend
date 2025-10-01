import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ChatPopover from "../../components/chat/ChatPopover";
import { useNavigate } from "react-router-dom";
import eyeIcon from "../../assets/eye.svg";
import { io } from "socket.io-client";

let apiUrl = "https://pollingsystem-backend-6qbs.onrender.com";
const socket = io(apiUrl);

const TeacherPollPage = () => {
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState([]);
  const [votes, setVotes] = useState({});
  const [timeLeft, setTimeLeft] = useState(0); // countdown timer
  const [pollActive, setPollActive] = useState(false);
  const timerRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    socket.on("pollCreated", (pollData) => {
      setPollQuestion(pollData.question);
      setPollOptions(pollData.options);
      setVotes({});
      const remaining = Math.floor((pollData.endTime - Date.now()) / 1000);
      setTimeLeft(remaining > 0 ? remaining : 0);
      setPollActive(true);
    });

    socket.on("pollResults", (updatedVotes) => {
      setVotes(updatedVotes);
    });

    return () => {
      socket.off("pollCreated");
      socket.off("pollResults");
    };
  }, []);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && pollActive) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setPollActive(false); // poll ended
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [timeLeft, pollActive]);

  const calculatePercentage = (count) => {
    const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);
    if (totalVotes === 0) return 0;
    return (count / totalVotes) * 100;
  };

  const askNewQuestion = () => {
    navigate("/teacher-home-page");
  };

  const handleViewPollHistory = () => {
    navigate("/teacher-poll-history");
  };

  return (
    <>
      <div className="container mt-4">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            {pollActive && (
              <h5>
                Timer: <span className="text-danger">{timeLeft}s</span>
              </h5>
            )}
          </div>
          <div>
            <button
              className="btn rounded-pill ask-question poll-history px-4 m-2"
              onClick={handleViewPollHistory}
            >
              <img src={eyeIcon} alt="" style={{ width: 18, marginRight: 8 }} />
              View Poll history
            </button>
          </div>
        </div>

        {pollQuestion ? (
          <>
            <div className="card mb-3">
              <div className="card-body">
                <h6 className="question py-2 ps-2 text-left rounded text-white">
                  {pollQuestion} ?
                </h6>
                <div className="list-group mt-4">
                  {pollOptions.map((option) => (
                    <div key={option.id} className="list-group-item rounded m-2">
                      <div className="d-flex justify-content-between align-items-center">
                        <span>{option.text}</span>
                        <span>
                          {Math.round(calculatePercentage(votes[option.text] || 0))}%
                        </span>
                      </div>
                      <div className="progress mt-2">
                        <div
                          className="progress-bar progress-bar-bg"
                          role="progressbar"
                          style={{
                            width: `${calculatePercentage(votes[option.text] || 0)}%`,
                          }}
                          aria-valuenow={votes[option.text] || 0}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end">
              <button
                className="btn rounded-pill ask-question px-4 m-2"
                onClick={askNewQuestion}
                disabled={pollActive} // disable until timer ends
              >
                + Ask a new question
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-muted text-center py-5">
              Waiting for the teacher to start a new poll...
            </div>
            <div className="d-flex justify-content-center">
              <button
                className="btn rounded-pill ask-question px-4 m-2"
                onClick={askNewQuestion}
              >
                + Ask a new question
              </button>
            </div>
          </>
        )}

        <ChatPopover />
      </div>
    </>
  );
};

export default TeacherPollPage;
