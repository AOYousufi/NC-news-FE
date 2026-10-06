import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AUTH_EXPIRED_EVENT,
  TOKEN_KEY,
  clearStoredToken,
  fetchCurrentUser,
  getStoredToken,
  loginUser,
  registerUser,
  updateCurrentUser,
} from "../src/api/api";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [loggedUser, setLoggedUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(() =>
    Boolean(getStoredToken())
  );

  const logout = useCallback(() => {
    clearStoredToken();
    setLoggedUser(null);
  }, []);

  useEffect(() => {
    const handleExpiredSession = () => logout();
    window.addEventListener(AUTH_EXPIRED_EVENT, handleExpiredSession);

    return () => {
      window.removeEventListener(AUTH_EXPIRED_EVENT, handleExpiredSession);
    };
  }, [logout]);

  useEffect(() => {
    const token = getStoredToken();

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

  const saveSession = useCallback(({ user, token }, rememberMe = false) => {
    clearStoredToken();

    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(TOKEN_KEY, token);

    setLoggedUser(user);
    return user;
  }, []);

  const login = useCallback(
    async (credentials, rememberMe = false) =>
      saveSession(await loginUser(credentials), rememberMe),
    [saveSession]
  );

  const register = useCallback(
    async (details, rememberMe = false) =>
      saveSession(await registerUser(details), rememberMe),
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
