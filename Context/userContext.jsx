import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  fetchCurrentUser,
  loginUser,
  registerUser,
  updateCurrentUser,
} from "../src/api/api";

const TOKEN_KEY = "ncNewsToken";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [loggedUser, setLoggedUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(
    Boolean(localStorage.getItem(TOKEN_KEY))
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setLoggedUser(null);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setIsAuthLoading(false);
      return;
    }

    let active = true;

    fetchCurrentUser()
      .then((user) => {
        if (active) setLoggedUser(user);
      })
      .catch(() => {
        if (active) logout();
      })
      .finally(() => {
        if (active) setIsAuthLoading(false);
      });

    return () => {
      active = false;
    };
  }, [logout]);

  const saveSession = useCallback(({ user, token }) => {
    localStorage.setItem(TOKEN_KEY, token);
    setLoggedUser(user);
    return user;
  }, []);

  const login = useCallback(
    async (credentials) => saveSession(await loginUser(credentials)),
    [saveSession]
  );

  const register = useCallback(
    async (details) => saveSession(await registerUser(details)),
    [saveSession]
  );

  const updateProfile = useCallback(async (updates) => {
    const user = await updateCurrentUser(updates);
    setLoggedUser(user);
    return user;
  }, []);

  const value = useMemo(
    () => ({
      loggedUser,
      isAuthLoading,
      login,
      logout,
      register,
      updateProfile,
    }),
    [isAuthLoading, loggedUser, login, logout, register, updateProfile]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
