import { createContext } from "react";

export interface AuthContextType {
  authenticated: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  authenticated: true,
});
