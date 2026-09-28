import { createContext } from "react";

export interface SessionContextValue {
  apiUrl: string;
  idInstance: string;
  apiTokenInstance: string;
  isAuthenticated: boolean;
  login: (idInstance: string, apiTokenInstance: string) => void;
  logout: () => void;
}

export const SessionContext = createContext<SessionContextValue | null>(null);
