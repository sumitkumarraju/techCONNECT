"use client";

import { io } from "socket.io-client";

const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000"; // Fallback/dev URL

const socket = io(socketUrl, {
    autoConnect: false
});

export default socket;
