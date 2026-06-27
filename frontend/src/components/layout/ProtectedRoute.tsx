import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AvatarLoader from '../ui/AvatarLoader';

export default function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-app">
        <AvatarLoader size="xl" />
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
