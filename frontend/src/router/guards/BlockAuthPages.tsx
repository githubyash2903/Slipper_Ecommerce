import { Navigate, Outlet } from "react-router-dom";
import { authStorage } from "@/utils/auth";

export const BlockAuthPages = () => {
  if (authStorage.isAuthenticated()) {
    const role = authStorage.getRole();
    return (
      <Navigate
        to={role === "admin" ? "/admin" : "/profile"}
        replace
      />
    );
  }

  return <Outlet />;
};
