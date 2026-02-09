import {
  createContext,
  useContext,
  useMemo,
  useCallback,
} from "react";
import { authStorage } from "@/utils/auth";
type Role = "admin" | "user" | null;


interface AuthContextType {
  isAuthenticated: boolean;
  
  role: Role;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

  const isAuthenticated = authStorage.isAuthenticated();
  const role = authStorage.getRole();

  const logout = useCallback(() => {
    authStorage.clear();
    
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated, role, logout }),
    [isAuthenticated, role, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
