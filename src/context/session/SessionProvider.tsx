import { useCallback, useState, type ReactNode } from "react";
import { SessionContext, type SessionContextValue } from "./SessionContext";

const DEFAULT_API_URL = "https://api.green-api.com";

export function SessionProvider({ children }: { children: ReactNode }) {
  const [apiUrl, setApiUrl] = useState(DEFAULT_API_URL);
  const [idInstance, setIdInstance] = useState("");
  const [apiTokenInstance, setApiTokenInstance] = useState("");

  const login = useCallback(
    (nextIdInstance: string, nextApiTokenInstance: string, nextApiUrl?: string) => {
      setIdInstance(nextIdInstance.trim());
      setApiTokenInstance(nextApiTokenInstance.trim());
      if (nextApiUrl?.trim()) {
        setApiUrl(nextApiUrl.trim());
      }
    },
    [],
  );

  const logout = useCallback(() => {
    setIdInstance("");
    setApiTokenInstance("");
    setApiUrl(DEFAULT_API_URL);
  }, []);

  const isAuthenticated = idInstance.length > 0 && apiTokenInstance.length > 0;

  const value: SessionContextValue = {
    apiUrl,
    idInstance,
    apiTokenInstance,
    isAuthenticated,
    login,
    logout,
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
