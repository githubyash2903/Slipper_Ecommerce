export type UserRole = "admin" | "user";

const TOKEN_KEY = "token";
const ROLE_KEY = "role";

export const authStorage = {
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  getRole(): UserRole | null {
    return localStorage.getItem(ROLE_KEY) as UserRole | null;
  },

  isAuthenticated() {
    return Boolean(this.getToken());
  },

  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
  },
};
