import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/rbacMiddleware';
import {
  getDashboardStats,
  getUsers,
  updateUserStatus,
  updateUserRole,
  getFeatureFlags,
  getPublicFeatureFlags,
  updateFeatureFlag,
  getAuditLogs,
  getUpgradeRequests,
  processUpgradeRequest,
  createUpgradeRequest,
  getSystemConfig,
  updateSystemConfig
} from '../controllers/adminController';

const router = express.Router();

// User endpoints
router.post('/upgrade-request', protect, createUpgradeRequest);
router.get('/features/public', protect, getPublicFeatureFlags);
router.get('/config/public', protect, getSystemConfig);

// Admin protected endpoints
router.use(protect);
router.use(requireRole(['Admin', 'SuperAdmin']));

router.get('/stats', getDashboardStats);
router.get('/users', getUsers);
router.put('/users/:id/status', updateUserStatus);
router.put('/users/:id/role', updateUserRole);

router.get('/features', getFeatureFlags);
router.put('/features', updateFeatureFlag);

router.get('/audit-logs', getAuditLogs);

router.get('/upgrades', getUpgradeRequests);
router.put('/upgrades/:id', processUpgradeRequest);

router.put('/config', updateSystemConfig);

export default router;
