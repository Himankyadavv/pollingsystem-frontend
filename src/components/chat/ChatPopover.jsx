// frontend/src/components/chat/ChatPopover.jsx
import React, { useState, useEffect, useRef } from "react";
import { Button, Popover, OverlayTrigger, Tab, Nav } from "react-bootstrap";
import Chat from "./Chat";
import "./Chat.css";
import chatIcon from "../../assets/chat.svg";
import { socket } from "../../socket"; // <- shared socket

const ChatPopover = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [participants, setParticipants] = useState([]);
  const chatWindowRef = useRef(null);

  useEffect(() => {
    // scroll (if Chat uses the ref)
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }

    const username = (sessionStorage.getItem("username") || "").trim();
    if (username) {
      // joinChat only once with the shared socket
      socket.emit("joinChat", { username });
    }

    const handleChatMessage = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    const handleParticipantsUpdate = (participantsList) => {
      setParticipants(participantsList);
    };

    socket.on("chatMessage", handleChatMessage);
    socket.on("participantsUpdate", handleParticipantsUpdate);

    return () => {
      socket.off("chatMessage", handleChatMessage);
      socket.off("participantsUpdate", handleParticipantsUpdate);
    };
    // empty deps so this runs once on mount
  }, []);

  const username = sessionStorage.getItem("username") || "";

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = { user: username, text: newMessage.trim() };
      socket.emit("chatMessage", message);
      setNewMessage("");
    }
  };

  const handleKickOut = (participant) => {
    if (!participant) return;
    if (!window.confirm(`Kick out ${participant}?`)) return;
    // send exact username string (trimmed)
    socket.emit("kickOut", participant.trim());
  };

  const participantsTab = (
    <div style={{ maxHeight: "300px", overflowY: "auto" }}>
      {participants.length === 0 ? (
        <div>No participants connected</div>
      ) : (
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Name</th>
              {username.startsWith("teacher") ? <th>Actions</th> : null}
            </tr>
          </thead>
          <tbody>
            {participants.map((participant, index) => (
              <tr key={index}>
                <td>{participant}</td>
                {username.startsWith("teacher") ? (
                  <td>
                    <button
                      style={{ fontSize: "10px" }}
                      onClick={() => handleKickOut(participant)}
                      className="btn btn-link"
                    >
                      Kick Out
                    </button>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  const popover = (
    <Popover
      id="chat-popover"
      style={{ width: "400px", height: "400px", fontSize: "12px" }}
    >
      <Popover.Body style={{ height: "100%" }}>
        <Tab.Container defaultActiveKey="chat">
          <Nav variant="underline">
            <Nav.Item>
              <Nav.Link className="tab-item message-form" eventKey="chat">
                Chat
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link className="tab-item" eventKey="participants">
                Participants
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content className="mt-10 ">
            <Tab.Pane eventKey="chat">
              <Chat
                messages={messages}
                newMessage={newMessage}
                onMessageChange={setNewMessage}
                onSendMessage={handleSendMessage}
              />
            </Tab.Pane>
            <Tab.Pane eventKey="participants">{participantsTab}</Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Popover.Body>
    </Popover>
  );

  return (
    <OverlayTrigger trigger="click" placement="left" overlay={popover} rootClose>
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          padding: "10px",
          background: "rgba(90, 102, 209, 1)",
          borderRadius: "100%",
          cursor: "pointer",
        }}
      >
        <img style={{ width: "30px", height: "30px" }} src={chatIcon} alt="chat icon" />
      </div>
    </OverlayTrigger>
  );
};

export default ChatPopover;
