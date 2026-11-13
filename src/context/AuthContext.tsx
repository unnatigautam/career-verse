
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  signupUser,
  loginUser,
  getCurrentUser,
  type AuthUser,
  type SignupData,
  type LoginData,
} from "../services/authService";

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  signup: (data: SignupData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const syncUserStorage = (user: AuthUser) => {
  localStorage.setItem("careerverse-user", JSON.stringify(user));

  if (user.name) {
    localStorage.setItem("careerverse-name", user.name);
  }

  if (user.email) {
    localStorage.setItem("careerverse-email", user.email);
  }
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("careerverse-token")
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const verifySession = async () => {
      const storedToken = localStorage.getItem("careerverse-token");
      const storedUser = localStorage.getItem("careerverse-user");

      if (!storedToken || !storedUser) {
        if (active) {
          setUser(null);
          setToken(null);
          setLoading(false);
        }
        return;
      }

      try {
        const parsedUser = JSON.parse(storedUser) as AuthUser;

        if (active) {
          setToken(storedToken);
          setUser(parsedUser);
          syncUserStorage(parsedUser);
        }

        const response = await getCurrentUser();

        // Refresh user details if the API returns them.
        const currentUser =
          response?.user ?? response?.data?.user ?? response;

        if (
          active &&
          currentUser &&
          typeof currentUser === "object" &&
          (currentUser.name || currentUser.email)
        ) {
          const mergedUser = {
            ...parsedUser,
            ...currentUser,
          } as AuthUser;

          setUser(mergedUser);
          syncUserStorage(mergedUser);
        }
      } catch (error) {
        console.error("Session verification failed:", error);

        if (active) {
          localStorage.removeItem("careerverse-token");
          localStorage.removeItem("careerverse-user");
          localStorage.removeItem("careerverse-name");
          localStorage.removeItem("careerverse-email");
          setToken(null);
          setUser(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    verifySession();

    return () => {
      active = false;
    };
  }, []);

  const signup = async (data: SignupData) => {
    const response = await signupUser(data);

    localStorage.setItem("careerverse-token", response.token);
    syncUserStorage(response.user);

    setToken(response.token);
    setUser(response.user);
  };

  const login = async (data: LoginData) => {
    const response = await loginUser(data);

    localStorage.setItem("careerverse-token", response.token);
    syncUserStorage(response.user);

    setToken(response.token);
    setUser(response.user);
  };

  const logout = () => {
    localStorage.removeItem("careerverse-token");
    localStorage.removeItem("careerverse-user");
    localStorage.removeItem("careerverse-name");
    localStorage.removeItem("careerverse-email");
    localStorage.removeItem("careerverse-assessment");

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user),
        loading,
        signup,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
