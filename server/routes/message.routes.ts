import express from 'express';
import protect from '../middleware/auth';
import { getMessages, sendMessage } from '../controllers/message.controller';

const router = express.Router();

// Note: These routes were mounted at /api/projects previously for GET, but generic /api for tasks/messages?
// backend/server.js: app.use("/api", taskRoutes); app.use("/api", messageRoutes);
// And message.routes.js had: router.get("/projects/:id/messages", ...)
// So they are: /api/projects/:id/messages
// I will keep the router paths as is and mount them correctly in server.ts

router.get("/projects/:id/messages", protect, getMessages);
router.post("/projects/:id/messages", protect, sendMessage);

export default router;
