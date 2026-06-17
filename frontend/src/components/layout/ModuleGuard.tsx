import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ModuleGuard({ moduleName }: { moduleName: string }) {
  const { user, featureFlags, isFlagsLoading } = useAuth();
  
  if (isFlagsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand"></div>
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
  
  return <Outlet />;
}
