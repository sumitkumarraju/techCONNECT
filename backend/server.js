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
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
}));

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
        credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000,
});

// Socket Auth Middleware — optional in dev mode
io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    // In development, allow connections without token for easier testing
    if (!token && process.env.NODE_ENV === 'development') {
        socket.decoded = { id: 'anonymous-' + socket.id };
        return next();
    }

    if (!token) {
        return next(new Error("Authentication error"));
    }

    jwt.verify(token, process.env.JWT_SECRET || 'devsecret', (err, decoded) => {
        if (err) {
            console.warn("Socket auth failed:", err.message);
            // In dev, allow anyway
            if (process.env.NODE_ENV === 'development') {
                socket.decoded = { id: 'unverified-' + socket.id };
                return next();
            }
            return next(new Error("Authentication error"));
        }
        socket.decoded = decoded;
        next();
    });
});

// Presence State
const projectUsers = new Map(); // projectId -> [{ socketId, ...user }]

io.on("connection", (socket) => {
    console.log("✅ User Connected:", socket.id);

    // Join Project & Presence
    socket.on("user-join", ({ projectId, user }) => {
        socket.join(projectId);
        console.log(`User ${user?.name || 'Unknown'} joined project: ${projectId}`);

        if (!projectUsers.has(projectId)) {
            projectUsers.set(projectId, []);
        }

        const users = projectUsers.get(projectId);
        // Remove stale entries for this socket or same user identity
        const normalizedUserId = user?._id || user?.id || null;
        const filteredUsers = users.filter((u) => {
            if (u.socketId === socket.id) return false;
            if (normalizedUserId && (u._id === normalizedUserId || u.id === normalizedUserId)) return false;
            return true;
        });

        // Avoid duplicates if using same socket (re-join)
        const existingIdx = filteredUsers.findIndex(u => u.socketId === socket.id);
        if (existingIdx !== -1) {
            filteredUsers[existingIdx] = { ...user, socketId: socket.id };
        } else {
            filteredUsers.push({ ...user, socketId: socket.id });
        }

        projectUsers.set(projectId, filteredUsers);

        // Broadcast presence
        io.to(projectId).emit("presence-update", filteredUsers);
        // Notify existing members that someone joined
        socket.to(projectId).emit("user-joined-notice", {
            user: {
                _id: user?._id,
                name: user?.name || user?.username || "A user",
                username: user?.username || user?.name || "user",
            },
            projectId,
            joinedAt: new Date().toISOString(),
        });
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

    // File Update (from version restore etc.)
    socket.on("file-update", ({ fileId, content }) => {
        socket.broadcast.emit("code-update", { fileId, content });
    });

    socket.on("disconnect", (reason) => {
        console.log("❌ User Disconnected:", socket.id, "Reason:", reason);
        // Cleanup presence
        for (const [projectId, users] of projectUsers.entries()) {
            const leavingUser = users.find((u) => u.socketId === socket.id);
            const updated = users.filter(u => u.socketId !== socket.id);
            if (updated.length !== users.length) {
                projectUsers.set(projectId, updated);
                io.to(projectId).emit("presence-update", updated);
                if (leavingUser) {
                    io.to(projectId).emit("user-left-notice", {
                        user: {
                            _id: leavingUser._id || leavingUser.id,
                            name: leavingUser.name || leavingUser.username || "A user",
                            username: leavingUser.username || leavingUser.name || "user",
                        },
                        projectId,
                        leftAt: new Date().toISOString(),
                    });
                }
            }
        }
    });
});

// Periodic stale socket cleanup (helps after abrupt disconnects/network drops)
const PRESENCE_PRUNE_INTERVAL_MS = 15000;
setInterval(() => {
    for (const [projectId, users] of projectUsers.entries()) {
        const activeUsers = users.filter((u) => io.sockets.sockets.has(u.socketId));
        const staleUsers = users.filter((u) => !io.sockets.sockets.has(u.socketId));

        if (activeUsers.length !== users.length) {
            projectUsers.set(projectId, activeUsers);
            io.to(projectId).emit("presence-update", activeUsers);
            staleUsers.forEach((staleUser) => {
                io.to(projectId).emit("user-left-notice", {
                    user: {
                        _id: staleUser._id || staleUser.id,
                        name: staleUser.name || staleUser.username || "A user",
                        username: staleUser.username || staleUser.name || "user",
                    },
                    projectId,
                    leftAt: new Date().toISOString(),
                });
            });
        }
    }
}, PRESENCE_PRUNE_INTERVAL_MS);

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({ status: "ok", connections: io.engine?.clientsCount || 0 });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
    console.log(`🚀 Socket Server running on port ${PORT}`);
});
