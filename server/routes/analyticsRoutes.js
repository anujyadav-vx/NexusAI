import express from 'express';
import { getUserAnalytics } from '../controllers/analyticsController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/usage', requireAuth, getUserAnalytics);

export default router;
