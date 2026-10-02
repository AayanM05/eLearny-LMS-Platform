import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/** Gates a route behind login, and optionally a set of allowed roles (FR-level RBAC mirrors the backend). */
export default function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}
