require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");

const app = express();
const server = http.createServer(app);

// Socket.IO server
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Update this if your frontend runs on a different port
        methods: ["GET", "POST"]
    }
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth.routes");
const projectRoutes = require("./routes/project.routes");
const exploreRoutes = require("./routes/explore.routes");
const communityRoutes = require("./routes/community.routes");
const taskRoutes = require("./routes/task.routes");
const messageRoutes = require("./routes/message.routes");

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/explore", exploreRoutes);
app.use("/api/community", communityRoutes);
app.use("/api", taskRoutes);
app.use("/api", messageRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("TechConnect API running 🚀");
});

const onlineUsers = {}; // projectId -> [users]

// ---- SOCKET EVENTS ----
io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    // Join project room
    socket.on("join-project", ({ projectId, user }) => {
        socket.join(projectId);

        // Track online users
        if (!onlineUsers[projectId]) {
            onlineUsers[projectId] = [];
        }
        onlineUsers[projectId].push({ ...user, socketId: socket.id });

        // Broadcast new list
        io.to(projectId).emit("online-users", onlineUsers[projectId]);
    });

    // Send message
    socket.on("send-message", ({ projectId, message }) => {
        socket.to(projectId).emit("receive-message", message);
    });

    // Real-time Tasks
    socket.on("task-updated", ({ projectId, task }) => {
        socket.to(projectId).emit("task-sync", task);
    });

    // Live Code Editor
    socket.on("code-change", ({ projectId, code }) => {
        socket.to(projectId).emit("code-update", code);
    });

    // Handle Disconnect
    socket.on("disconnecting", () => {
        for (const room of socket.rooms) {
            if (onlineUsers[room]) {
                onlineUsers[room] = onlineUsers[room].filter(
                    (u) => u.socketId !== socket.id
                );
                io.to(room).emit("online-users", onlineUsers[room]);
            }
        }
    });

    // Leave
    socket.on("disconnect", () => {
        console.log("🔴 User disconnected:", socket.id);
    });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
    console.log(`🚀 Server running with Socket.IO on ${PORT}`)
);
