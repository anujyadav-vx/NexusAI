import express from 'express';
import { getAdminOverview, updateUserRole, deleteUser } from '../controllers/adminController.js';
import { requireAuth, requireAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(requireAuth);
router.use(requireAdmin);

router.get('/overview', getAdminOverview);
router.put('/users/:userId', updateUserRole);
router.delete('/users/:userId', deleteUser);

export default router;
