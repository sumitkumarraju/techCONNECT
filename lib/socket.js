"use client";

import { io } from "socket.io-client";

const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5001";

const socket = io(socketUrl, {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 10000,
    transports: ["websocket", "polling"],
});

// Attach auth token before connecting
socket.on("connect_error", (err) => {
    console.warn("Socket connection error:", err.message);
    // If auth error, try reconnecting with token
    if (err.message === "Authentication error" && typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
            socket.auth = { token };
            socket.connect();
        }
    }
});

// Auto-attach token when connecting
if (typeof window !== "undefined") {
    const originalConnect = socket.connect.bind(socket);
    socket.connect = () => {
        const token = localStorage.getItem("token");
        if (token) {
            socket.auth = { token };
        }
        return originalConnect();
    };
}

socket.on("connect", () => {
    console.log("🔌 Socket connected:", socket.id);
});

socket.on("disconnect", (reason) => {
    console.log("🔌 Socket disconnected:", reason);
});

export default socket;
