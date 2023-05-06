import { createContext } from "react";

export interface AuthContextType {
  authenticated: boolean;
  logout: () => void;
  setAuth: (value: boolean) => void;
}

export const AuthContext = createContext<AuthContextType>({
  authenticated: false,
  logout: () => {},
  setAuth: (value: boolean) => {},
});
