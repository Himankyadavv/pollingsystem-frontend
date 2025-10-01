import React, { useEffect, useRef } from "react";
import { Button, Form } from "react-bootstrap";
import "./Chat.css";

const Chat = ({ messages, newMessage, onMessageChange, onSendMessage }) => {
  const username = sessionStorage.getItem("username");
  const chatWindowRef = useRef(null);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Messages */}
      <div
        ref={chatWindowRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "15px",
          borderRadius: "10px",
          background: "#f8f9fa",
          fontSize: "14px",
          fontWeight: 500,
          lineHeight: 1.5,
        }}
      >
        {messages.length === 0 ? (
          <div style={{ fontSize: "14px", fontWeight: 500 }}>No messages yet</div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={msg.user === username ? "current-user" : "other-user"}
              style={{
                alignSelf: msg.user === username ? "flex-end" : "flex-start",
                marginBottom: "12px",
              }}
            >
              <span style={{ marginRight: "5px", fontWeight: 600 }}>
                {msg.user === username ? "You" : msg.user}:
              </span>
              <span
                style={{
                  wordWrap: "break-word",
                  whiteSpace: "pre-wrap",
                  display: "inline-block",
                  maxWidth: "80%",
                  fontWeight: 500,
                  fontSize: "14px",
                }}
              >
                {msg.text}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Input Box at bottom */}
      <div style={{ marginTop: "auto" }}>
        <Form.Group>
          <Form.Control
            type="text"
            value={newMessage}
            onChange={(e) => onMessageChange(e.target.value)}
            placeholder="Type a message"
            style={{
              fontSize: "14px",
              fontWeight: 500,
              borderRadius: "10px",
              border: "1px solid #ced4da",
              padding: "8px",
            }}
          />
        </Form.Group>
        <Button
          onClick={onSendMessage}
          className="mt-2"
          style={{
            borderRadius: "10px",
            border: "none",
            fontSize: "14px",
            fontWeight: 500,
            background: "rgba(90, 102, 209, 1)",
            width: "100%",
          }}
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default Chat;
