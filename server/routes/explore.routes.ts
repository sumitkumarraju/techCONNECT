import express from 'express';
import { getPublicProjects } from '../controllers/explore.controller';

const router = express.Router();

router.get("/projects", getPublicProjects);

export default router;
