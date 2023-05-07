import { createContext } from "react";

export interface AuthContextType {
  authenticated?: boolean;
  logout: () => void;
  setAuth: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  logout: () => {},
  setAuth: () => {},
});
