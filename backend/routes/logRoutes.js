// routes/logRoutes.js
import express from 'express';
import { getLogs } from '../controllers/logControllers.js';

const router = express.Router();
router.get('/logs', getLogs);

export default router;
