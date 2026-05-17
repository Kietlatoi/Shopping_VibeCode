import express from 'express';
import {
  approveProduct,
  getUsers,
  updateUserStatus,
  getDisputes,
  updateDisputeStatus,
  getAuditLogs,
  getDashboardStats
} from '../controllers/adminController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(restrictTo('Admin', 'Super Admin'));

router.get('/users', getUsers);
router.patch('/users/:id/status', updateUserStatus);
router.patch('/products/:id/approve', approveProduct);
router.get('/disputes', getDisputes);
router.patch('/disputes/:id', updateDisputeStatus);
router.get('/audit-logs', getAuditLogs);
router.get('/stats', getDashboardStats);

export default router;
