import express from 'express';
import protect from '../middleware/auth';
import { registerUser, loginUser, getMe } from '../controllers/auth.controller';

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);

export default router;
