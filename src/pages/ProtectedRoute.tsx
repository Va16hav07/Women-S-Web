import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../useAuth";  // ✅ Updated Import Path

const ProtectedRoute = () => {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;