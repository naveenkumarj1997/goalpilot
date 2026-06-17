import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';
import FeatureFlag from '../models/FeatureFlag';
import User from '../models/User';

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }
    
    // SuperAdmin always has access to role-protected routes unless strictly denied
    if (req.user.role === 'SuperAdmin' || roles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden: Insufficient role permissions' });
    }
  };
};

export const checkModuleAccess = (moduleName: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const userRole = req.user.role;

    // Admin/SuperAdmin bypass all module checks
    if (userRole === 'Admin' || userRole === 'SuperAdmin') {
      next();
      return;
    }

    try {
      // Check user specific override first
      const userDoc = await User.findById(req.user._id);
      const overrideVal = userDoc?.moduleOverrides?.has(moduleName) ? userDoc.moduleOverrides.get(moduleName) : undefined;

      if (overrideVal === false) {
        res.status(403).json({ message: `You have been restricted from accessing ${moduleName}.` });
        return;
      }

      // Check global feature flag
      const flag = await FeatureFlag.findOne({ moduleName });
      if (flag) {
        if (!flag.isEnabled) {
          res.status(403).json({ message: `Module ${moduleName} is currently disabled globally.` });
          return;
        }
        if (flag.isPremium && userRole !== 'Premium' && userRole !== 'Admin' && userRole !== 'SuperAdmin') {
          if (overrideVal === true) {
            // User has specifically purchased/unlocked this module
            return next();
          }
          res.status(403).json({
            message: `Access denied. ${moduleName} requires a Premium subscription.`,
            requiresUpgrade: true
          });
          return;
        }
      }

      next();
    } catch (error) {
      console.error('Error checking module access', error);
      res.status(500).json({ message: 'Error checking module access' });
    }
  };
};

export const blockCheck = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user) {
    next();
    return;
  }
  
  if (req.user.status === 'Blocked') {
    res.status(403).json({ message: 'Your account has been blocked.', isBlocked: true });
    return;
  }
  
  next();
};
