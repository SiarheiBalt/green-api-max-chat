import { useCallback, useState, type ReactNode } from "react";
import { resolveApiUrlFromInstance } from "../../lib/apiUrl";
import { SessionContext, type SessionContextValue } from "./SessionContext";

export function SessionProvider({ children }: { children: ReactNode }) {
  const [apiUrl, setApiUrl] = useState("");
  const [idInstance, setIdInstance] = useState("");
  const [apiTokenInstance, setApiTokenInstance] = useState("");

  const login = useCallback((nextIdInstance: string, nextApiTokenInstance: string) => {
    const id = nextIdInstance.trim();
    const token = nextApiTokenInstance.trim();
    if (!id || !token) {
      return;
    }
    setIdInstance(id);
    setApiTokenInstance(token);
    setApiUrl(resolveApiUrlFromInstance(id));
  }, []);

  const logout = useCallback(() => {
    setIdInstance("");
    setApiTokenInstance("");
    setApiUrl("");
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
