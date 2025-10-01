// frontend/src/socket.js
import { io } from "socket.io-client";

let apiUrl = "https://pollingsystem-backend-6qbs.onrender.com"

// Create a single socket instance for the whole frontend app
export const socket = io(apiUrl, {
  autoConnect: true,
  transports: ["websocket", "polling"],
});
