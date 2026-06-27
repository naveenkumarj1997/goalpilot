import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DEFAULT_UNLOCKED_MODULES } from '../../utils/modules';
import AvatarLoader from '../ui/AvatarLoader';

export default function ModuleGuard({ moduleName }: { moduleName: string }) {
  const { user, featureFlags, isFlagsLoading } = useAuth();
  
  if (isFlagsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <AvatarLoader size="xl" />
      </div>
    );
  }

  const flag = featureFlags?.find((f: any) => f.moduleName === moduleName);
  const overrideVal = user?.moduleOverrides ? user.moduleOverrides[moduleName] : undefined;
  
  if (overrideVal === false) {
    return <Navigate to="/dashboard" replace />;
  }

  if (flag && !flag.isEnabled) {
    return <Navigate to="/dashboard" replace />;
  }
  
  if (flag && flag.isPremium && user?.role !== 'Premium' && user?.role !== 'Admin' && user?.role !== 'SuperAdmin') {
    if (overrideVal === true) {
      return <Outlet />;
    }
    return <Navigate to="/dashboard" replace />; // or /upgrade if we want to force it
  }

  // Check for default locked free modules
  const isPremiumModule = flag ? flag.isPremium : false;
  const isDefaultLocked = !DEFAULT_UNLOCKED_MODULES.includes(moduleName) && !isPremiumModule;
  if (isDefaultLocked && overrideVal !== true && user?.role !== 'Admin' && user?.role !== 'SuperAdmin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Outlet />;
}
