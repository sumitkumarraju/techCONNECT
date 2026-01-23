import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import next from 'next';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './lib/db';

// Routes
import authRoutes from './server/routes/auth.routes';
import projectRoutes from './server/routes/project.routes';
import exploreRoutes from './server/routes/explore.routes';
import communityRoutes from './server/routes/community.routes';
import taskRoutes from './server/routes/task.routes';
import messageRoutes from './server/routes/message.routes';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Connect to MongoDB
connectDB();

app.prepare().then(() => {
  const server = express();
  const httpServer = createServer(server);
  const io = new Server(httpServer);

  // Middleware
  server.use(express.json());

  // API Routes
  server.use("/api/auth", authRoutes);
  server.use("/api/projects", projectRoutes);
  server.use("/api/explore", exploreRoutes);
  server.use("/api/community", communityRoutes);
  server.use("/api", taskRoutes);
  server.use("/api", messageRoutes);

  // Socket.io Logic
  const onlineUsers: Record<string, any[]> = {}; // projectId -> [users]

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join project room
    socket.on("join-project", ({ projectId, user }: { projectId: string, user: any }) => {
        socket.join(projectId);
        console.log(`Socket ${socket.id} joined project ${projectId}`);

        // Track online users
        if (!onlineUsers[projectId]) {
            onlineUsers[projectId] = [];
        }

        // Remove existing instance of this user if any (to update socketId)
        // or just append. Let's filter out old socketId first?
        // Actually, user might open multiple tabs. We want to track socketIds.

        onlineUsers[projectId].push({ ...user, socketId: socket.id });

        // Broadcast new list
        io.to(projectId).emit("online-users", onlineUsers[projectId]);
    });

    // Send message
    socket.on("send-message", ({ projectId, message }: { projectId: string, message: any }) => {
        socket.to(projectId).emit("receive-message", message);
    });

    // Real-time Tasks
    socket.on("task-updated", ({ projectId, task }: { projectId: string, task: any }) => {
        socket.to(projectId).emit("task-sync", task);
    });

    // Live Code Editor
    socket.on("code-change", ({ projectId, code }: { projectId: string, code: string }) => {
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

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  // Next.js Handler
  server.all('*', (req: Request, res: Response) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
