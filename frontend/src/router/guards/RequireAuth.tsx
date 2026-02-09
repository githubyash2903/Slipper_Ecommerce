import { Navigate, Outlet } from "react-router-dom";
import { authStorage } from "@/utils/auth";

export const RequireAuth = () => {
  if (!authStorage.isAuthenticated()) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};
