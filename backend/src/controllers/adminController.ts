import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import User from '../models/User';
import FeatureFlag from '../models/FeatureFlag';
import AuditLog from '../models/AuditLog';
import UpgradeRequest from '../models/UpgradeRequest';
import SystemConfig from '../models/SystemConfig';
import SupportMessage from '../models/SupportMessage';
import mongoose from 'mongoose';

const logAction = async (adminId: any, action: string, targetUserId?: any, details?: string) => {
  await AuditLog.create({
    adminId,
    action,
    targetUserId,
    details
  });
};

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const activeUsers = await User.countDocuments({ lastActiveAt: { $gte: startOfDay } });
    const blockedUsers = await User.countDocuments({ status: 'Blocked' });
    
    // Get pending upgrades
    const pendingUpgrades = await UpgradeRequest.countDocuments({ status: 'Pending' });

    res.json({ totalUsers, activeUsers, blockedUsers, pendingUpgrades });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
};

export const getDailyActiveUsers = async (req: AuthRequest, res: Response) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const users = await User.find({ lastActiveAt: { $gte: startOfDay } })
      .select('name email lastActiveAt role')
      .sort({ lastActiveAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching daily active users' });
  }
};

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';
    const sortBy = req.query.sortBy as string || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    let query: any = {};

    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const totalCount = await User.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);
    const skip = (page - 1) * limit;

    const users = await User.find(query)
      .select('-password')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    res.json({
      users,
      totalCount,
      totalPages,
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

export const updateUserStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, blockReason } = req.body;
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent Admin from blocking SuperAdmin
    if (user.role === 'SuperAdmin' && req.user?.role !== 'SuperAdmin') {
      return res.status(403).json({ message: 'Cannot modify SuperAdmin status' });
    }

    user.status = status;
    if (status === 'Blocked') {
      user.blockReason = blockReason;
    } else {
      user.blockReason = '';
    }
    
    await user.save();
    
    await logAction(req.user?._id, status === 'Blocked' ? 'BLOCK_USER' : 'UNBLOCK_USER', user._id, blockReason);
    
    res.json({ message: `User status updated to ${status}` });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user status' });
  }
};

export const updateUserRole = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    // Only SuperAdmin can make other SuperAdmins or Admins
    if ((role === 'SuperAdmin' || role === 'Admin') && req.user?.role !== 'SuperAdmin') {
      return res.status(403).json({ message: 'Not authorized to grant this role' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();
    
    await logAction(req.user?._id, 'CHANGE_ROLE', user._id, `Changed role to ${role}`);
    
    res.json({ message: `User role updated to ${role}` });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user role' });
  }
};

export const getPublicFeatureFlags = async (req: AuthRequest, res: Response) => {
  try {
    // Only return moduleName and isEnabled to avoid exposing sensitive admin data if any
    const flags = await FeatureFlag.find({}).select('moduleName isEnabled isPremium price maintenanceMode');
    res.json(flags);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching flags' });
  }
};

export const getFeatureFlags = async (req: AuthRequest, res: Response) => {
  try {
    const flags = await FeatureFlag.find({});
    res.json(flags);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feature flags' });
  }
};

export const updateFeatureFlag = async (req: AuthRequest, res: Response) => {
  try {
    const { moduleName, isEnabled, isPremium, maintenanceMode, price } = req.body;
    
    let flag = await FeatureFlag.findOne({ moduleName });
    if (flag) {
      flag.isEnabled = isEnabled !== undefined ? isEnabled : flag.isEnabled;
      if (maintenanceMode !== undefined) flag.maintenanceMode = maintenanceMode;
      if (isPremium !== undefined) flag.isPremium = isPremium;
      if (price !== undefined) flag.price = price;
      flag.updatedBy = req.user?._id;
      await flag.save();
    } else {
      flag = await FeatureFlag.create({
        moduleName,
        isEnabled,
        isPremium: isPremium || false,
        price: price || 0,
        maintenanceMode,
        updatedBy: req.user?._id
      });
    }
    
    await logAction(req.user?._id, 'UPDATE_FEATURE_FLAG', undefined, `Module: ${moduleName}, Enabled: ${flag.isEnabled}`);
    
    res.json(flag);
  } catch (error) {
    res.status(500).json({ message: 'Error updating feature flag' });
  }
};

export const getAuditLogs = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';
    const sortBy = req.query.sortBy as string || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    let query: any = {};

    if (search) {
      // Find users matching search to filter by adminId or targetUserId
      const matchingUsers = await User.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      }).select('_id');
      const userIds = matchingUsers.map(u => u._id);

      query = {
        $or: [
          { action: { $regex: search, $options: 'i' } },
          { details: { $regex: search, $options: 'i' } },
          { adminId: { $in: userIds } },
          { targetUserId: { $in: userIds } }
        ]
      };
    }

    const totalCount = await AuditLog.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);
    const skip = (page - 1) * limit;

    const logs = await AuditLog.find(query)
      .populate('adminId', 'name email')
      .populate('targetUserId', 'name email')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    res.json({
      logs,
      totalCount,
      totalPages,
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching audit logs' });
  }
};

export const getUpgradeRequests = async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, search = '', sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    let query: any = {};
    if (search) {
      const users = await User.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      } as any).select('_id');
      const userIds = users.map(u => u._id);
      
      query = {
        $or: [
          { moduleName: { $regex: search, $options: 'i' } },
          { transactionReference: { $regex: search, $options: 'i' } },
          { status: { $regex: search, $options: 'i' } },
          { user: { $in: userIds } }
        ]
      };
    }

    const totalCount = await UpgradeRequest.countDocuments(query);
    const totalPages = Math.ceil(totalCount / Number(limit));
    const skip = (Number(page) - 1) * Number(limit);

    const sortConfig: any = {};
    sortConfig[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    const requests = await UpgradeRequest.find(query)
      .populate('user', 'name email')
      .sort(sortConfig)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      requests,
      totalCount,
      totalPages,
      currentPage: Number(page)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requests' });
  }
};

export const processUpgradeRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Approved or Rejected
    
    const request = await UpgradeRequest.findById(id).populate('user');
    if (!request) return res.status(404).json({ message: 'Request not found' });
    
    request.status = status;
    request.reviewedBy = req.user?._id;
    await request.save();
    
    if (status === 'Approved') {
      const user = await User.findById(request.user._id);
      if (user) {
        if (request.moduleName === 'VIP Premium') {
          user.role = 'Premium';
          await user.save();
          await logAction(req.user?._id, 'APPROVE_UPGRADE', user._id, `Granted VIP Premium role`);
        } else {
          if (!user.moduleOverrides) {
            user.moduleOverrides = new Map();
          }
          user.moduleOverrides.set(request.moduleName, true);
          await user.save();
          await logAction(req.user?._id, 'APPROVE_UPGRADE', user._id, `Unlocked premium module: ${request.moduleName}`);
        }
      }
    }
    
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Error processing request' });
  }
};

export const createUpgradeRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { transactionReference, moduleName, pricePaid } = req.body;
    
    if (!moduleName) {
      return res.status(400).json({ message: 'Module name is required' });
    }

    // Check if pending exists for THIS specific module
    const existing = await UpgradeRequest.findOne({ user: req.user?._id, moduleName, status: 'Pending' });
    if (existing) {
      return res.status(400).json({ message: 'You already have a pending upgrade request for this module' });
    }
    
    const request = await UpgradeRequest.create({
      user: req.user?._id,
      moduleName,
      pricePaid,
      status: 'Pending',
      transactionReference
    });
    
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Error creating request' });
  }
};

export const getSystemConfig = async (req: AuthRequest, res: Response) => {
  try {
    const config = await SystemConfig.find({});
    // Convert array of key-value pairs to a single object
    const configObj = config.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as any);
    res.json(configObj);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching system config' });
  }
};

export const updateSystemConfig = async (req: AuthRequest, res: Response) => {
  try {
    const { key, value } = req.body;
    
    let config = await SystemConfig.findOne({ key });
    if (config) {
      config.value = value;
      config.updatedBy = req.user?._id;
      await config.save();
    } else {
      config = await SystemConfig.create({
        key,
        value,
        updatedBy: req.user?._id
      });
    }
    
    await logAction(req.user?._id, 'UPDATE_SYSTEM_CONFIG', undefined, `Updated config: ${key}`);
    
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: 'Error updating system config' });
  }
};

export const updateUserOverrides = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { overrides } = req.body; // Map of moduleName -> boolean
    
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Fetch premium flags to handle manual grants
    const premiumFlags = await FeatureFlag.find({ isPremium: true });
    const premiumModules = new Set(premiumFlags.map(f => f.moduleName));

    for (const mod of premiumModules) {
      const isNowUnlocked = overrides[mod] === true;
      
      if (isNowUnlocked) {
        const existingReq = await UpgradeRequest.findOne({ user: user._id, moduleName: mod, status: 'Approved' });
        if (!existingReq) {
          await UpgradeRequest.create({
            user: user._id,
            moduleName: mod,
            status: 'Approved',
            pricePaid: 0,
            transactionReference: 'Granted manually by Admin',
            reviewedBy: req.user?._id
          });
        }
      } else {
        await UpgradeRequest.deleteOne({ 
          user: user._id, 
          moduleName: mod, 
          status: 'Approved',
          transactionReference: 'Granted manually by Admin'
        });
      }
    }

    user.moduleOverrides = new Map(Object.entries(overrides));
    await user.save();
    
    await logAction(req.user?._id, 'UPDATE_USER_OVERRIDES', user._id, 'Updated specific module overrides');
    res.json({ message: 'User overrides updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user overrides' });
  }
};

export const getSupportConversations = async (req: AuthRequest, res: Response) => {
  try {
    // Get all distinct users who have sent support messages
    const messages = await SupportMessage.find({}).populate('user', 'name email').sort({ createdAt: 1 });
    
    // Group by user
    const conversations: any = {};
    messages.forEach((msg: any) => {
      if (!msg.user) return;
      const userId = msg.user._id.toString();
      if (!conversations[userId]) {
        conversations[userId] = {
          user: msg.user,
          messages: [],
          unreadCount: 0
        };
      }
      conversations[userId].messages.push(msg);
      if (msg.sender === 'User' && !msg.isRead) {
        conversations[userId].unreadCount += 1;
      }
    });

    res.json(Object.values(conversations).sort((a: any, b: any) => {
      const lastA = a.messages[a.messages.length - 1].createdAt;
      const lastB = b.messages[b.messages.length - 1].createdAt;
      return new Date(lastB).getTime() - new Date(lastA).getTime();
    }));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching conversations' });
  }
};

export const replyToSupportMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params; // User ID
    const { text } = req.body;
    
    const message = await SupportMessage.create({
      user: new mongoose.Types.ObjectId(id as string),
      sender: 'Admin',
      text
    });

    // Mark previous user messages as read
    await SupportMessage.updateMany(
      { user: id, sender: 'User', isRead: false },
      { isRead: true }
    );

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Error sending reply' });
  }
};

export const getPremiumPurchases = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';
    const sortBy = req.query.sortBy as string || 'updatedAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    let query: any = { status: 'Approved' };

    if (search) {
      // Find users matching search to filter by user
      const matchingUsers = await User.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      }).select('_id');
      const userIds = matchingUsers.map(u => u._id);

      query.$or = [
        { moduleName: { $regex: search, $options: 'i' } },
        { transactionReference: { $regex: search, $options: 'i' } },
        { user: { $in: userIds } }
      ];
    }

    const totalCount = await UpgradeRequest.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);
    const skip = (page - 1) * limit;

    const purchases = await UpgradeRequest.find(query)
      .populate('user', 'name email')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    res.json({
      purchases,
      totalCount,
      totalPages,
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching premium purchases' });
  }
};
