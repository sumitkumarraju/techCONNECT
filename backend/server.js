const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // Join Project Room
    socket.on("join-project", (data) => {
        // data: { projectId, user: { _id, name, ... } }
        socket.join(data.projectId);
        console.log(`User ${data.user.username} joined project: ${data.projectId}`);

        // Update online users list (simplified for MVP)
        // For a real app, track users per room in a Map/Redis
        const room = io.sockets.adapter.rooms.get(data.projectId);
        const numClients = room ? room.size : 0;

        // Broadcast to room that someone joined
        // Ideally we send the full list of users, but for now just count/notification
        // io.to(data.projectId).emit("online-users", Array.from(room)); 
    });

    // Join Specific File Room (Optional, but good for cleanliness)
    socket.on("join-file", (fileId) => {
        socket.join(`file:${fileId}`);
        console.log(`Socket ${socket.id} joined file: ${fileId}`);
    });

    // Code Change Event
    socket.on("code-change", ({ fileId, content }) => {
        // Broadcast to everyone else editing this file
        socket.to(`file:${fileId}`).emit("code-update", content);
    });

    // Chat Message
    socket.on("send-message", ({ projectId, message }) => {
        socket.to(projectId).emit("receive-message", message);
    });

    // Task Updates
    socket.on("task-updated", ({ projectId, task }) => {
        socket.to(projectId).emit("task-sync", task);
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
