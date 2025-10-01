// frontend/src/socket.js
import { io } from "socket.io-client";

let apiUrl =
  import.meta.env.VITE_NODE_ENV === "production"
    ? import.meta.env.VITE_API_BASE_URL
    : "http://localhost:3000";

// Create a single socket instance for the whole frontend app
export const socket = io(apiUrl, {
  autoConnect: true,
  transports: ["websocket", "polling"],
});
