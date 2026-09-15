import express from 'express';
import { getPlans, upgradePlan, getInvoices } from '../controllers/billingController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/plans', getPlans);
router.post('/upgrade', requireAuth, upgradePlan);
router.get('/invoices', requireAuth, getInvoices);

export default router;
