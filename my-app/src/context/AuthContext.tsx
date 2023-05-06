import { createContext } from "react";

export interface AuthContextType {
  authenticated: boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  authenticated: false,
  logout: () => {},
});
