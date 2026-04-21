import { create } from "zustand";

type User = {
  name: string;
  email: string;
  role: string;
};

type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
};

const DEMO_USER: User = {
  name: "Kiran Adari",
  email: "admin@industrial.com",
  role: "Admin",
};

const DEMO_EMAIL = "admin@industrial.com";
const DEMO_PASSWORD = "admin123";

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,

  login: (email: string, password: string) => {
    const isValid = email === DEMO_EMAIL && password === DEMO_PASSWORD;

    if (!isValid) {
      return false;
    }

    set({
      isAuthenticated: true,
      user: DEMO_USER,
    });

    return true;
  },

  logout: () => {
    set({
      isAuthenticated: false,
      user: null,
    });
  },
}));