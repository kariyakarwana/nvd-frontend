import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "../store/store";

const ProtectedRoute = ({ allowed }: { allowed: string[] }) => {
  const { token, role } = useSelector((state: RootState) => state.auth);

  if (!token) return <Navigate to="/" replace />;
  if (!allowed.includes(role!)) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
