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

    socket.on("file-open", ({ projectId, fileId }) => {
        socket.to(projectId).emit("file-opened", fileId);
    });

    socket.on("code-change", ({ projectId, fileId, content }) => {
        // Broadcast to project room, client filters by fileId
        socket.to(projectId).emit("code-update", {
            fileId,
            content,
        });
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
