import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { DecodedToken } from "../interfaces/users/Token";
import type { UserLogin } from "../interfaces/users/UserLogin";
import { getToken, removeToken, decodeToken, isTokenValid } from "../services/tokenService";
import { loginUser as apiLoginUser, logoutUser as apiLogoutUser } from "../services/userService";

type AuthContextValue = {
  user: DecodedToken | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isAuthReady: boolean;
  login: (credentials: UserLogin) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const init = () => {
      const t = getToken();
      if (!t || !isTokenValid(t)) {
        removeToken();
        setUser(null);
        setIsAuthReady(true);
        return;
      }
      setUser(decodeToken(t));
      setIsAuthReady(true);
    };

    init();

    const onStorage = (e: StorageEvent) => {
      if (e.key === "token") init();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = async (credentials: UserLogin) => {
    const { token } = await apiLoginUser(credentials);
    if (!isTokenValid(token)) {
      apiLogoutUser();
      setUser(null);
      throw new Error("Received invalid or expired token");
    }
    setUser(decodeToken(token));
  };

  const logout = () => {
    apiLogoutUser();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isAdmin: !!user?.isAdmin,
      isAuthReady,
      login,
      logout,
    }),
    [user, isAuthReady]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
