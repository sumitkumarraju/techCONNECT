const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();

const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const jwt = require("jsonwebtoken");

const app = express();

// Security Middleware
app.use(helmet());
app.use(compression());
app.use(cors());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

// Socket Auth Middleware
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error("Authentication error"));
    }
    jwt.verify(token, process.env.JWT_SECRET || 'devsecret', (err, decoded) => {
        if (err) return next(new Error("Authentication error"));
        socket.decoded = decoded;
        next();
    });
});

// Presence State
const projectUsers = new Map(); // projectId -> [{ socketId, ...user }]

io.on("connection", (socket) => {
    // Join Project & Presence
    socket.on("user-join", ({ projectId, user }) => {
        socket.join(projectId);
        console.log(`User ${user.name} joined project: ${projectId}`);

        if (!projectUsers.has(projectId)) {
            projectUsers.set(projectId, []);
        }

        const users = projectUsers.get(projectId);
        // Avoid duplicates if using same socket (re-join)
        const existingIdx = users.findIndex(u => u.socketId === socket.id);
        if (existingIdx !== -1) {
            users[existingIdx] = { ...user, socketId: socket.id };
        } else {
            users.push({ ...user, socketId: socket.id });
        }

        projectUsers.set(projectId, users);

        // Broadcast presence
        io.to(projectId).emit("presence-update", users);
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

    // Cursor Movement
    socket.on("cursor-move", ({ projectId, cursor }) => {
        socket.to(projectId).emit("cursor-update", {
            socketId: socket.id,
            cursor,
        });
    });

    // Typing Indicator
    socket.on("typing", ({ projectId, userId }) => {
        socket.to(projectId).emit("user-typing", userId);
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
        // Cleanup presence
        for (const [projectId, users] of projectUsers.entries()) {
            const updated = users.filter(u => u.socketId !== socket.id);
            if (updated.length !== users.length) {
                projectUsers.set(projectId, updated);
                io.to(projectId).emit("presence-update", updated);
            }
        }
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
