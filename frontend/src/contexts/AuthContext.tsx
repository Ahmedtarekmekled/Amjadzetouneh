import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import { useRouter } from "next/router";
import { authService, User } from "@/services/authService";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check authentication status on mount and token change
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await authService.getCurrentUser();
        setUser(response.data);

        // Only redirect to dashboard if user is on login page and successfully authenticated
        if (router.pathname === "/login" && response.data) {
          router.push("/dashboard");
        }
      } catch (error) {
        localStorage.removeItem("token");
        setUser(null);
        // Only redirect to login if not already on login page
        if (router.pathname !== "/login") {
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [router.pathname]);

  const login = async (email: string, password: string) => {
    try {
      const { token, user } = await authService.login(email, password);
      localStorage.setItem("token", token);
      setUser(user);
      router.push("/dashboard");
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      // console.error("Logout error:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("token");
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoading: loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { AuthContext };
