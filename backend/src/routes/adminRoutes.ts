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
  updateSystemConfig,
  updateUserOverrides,
  getSupportConversations,
  replyToSupportMessage
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
router.route('/users/:id/status')
  .put(updateUserStatus);

router.route('/users/:id/role')
  .put(updateUserRole);

router.route('/users/:id/overrides')
  .put(updateUserOverrides);

router.get('/features', getFeatureFlags);
router.put('/features', updateFeatureFlag);

router.get('/audit-logs', getAuditLogs);

router.get('/upgrades', getUpgradeRequests);
router.route('/upgrades/:id')
  .put(processUpgradeRequest);

router.route('/support/conversations')
  .get(getSupportConversations);

router.route('/support/conversations/:id/reply')
  .post(replyToSupportMessage);

router.put('/config', updateSystemConfig);

export default router;
