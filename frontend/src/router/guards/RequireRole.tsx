import { Navigate, Outlet } from "react-router-dom";
import { authStorage } from "@/utils/auth";

interface Props {
  allowed: Array<"admin" | "user">;
}

export const RequireRole = ({ allowed }: Props) => {
  const role = authStorage.getRole();

  if (!role || !allowed.includes(role)) {
    return (
      <Navigate
        to={role === "admin" ? "/admin" : "/profile"}
        replace
      />
    );
  }

  return <Outlet />;
};
