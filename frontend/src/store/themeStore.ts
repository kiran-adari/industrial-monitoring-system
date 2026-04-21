import { create } from "zustand";

type Theme = "dark" | "light";

type ThemeState = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
};

const getInitialTheme = (): Theme => {
  const saved = localStorage.getItem("theme");

  if (saved === "light" || saved === "dark") {
    return saved;
  }

  return "dark";
};

export const useThemeStore = create<ThemeState>((set) => ({
  theme: getInitialTheme(),

  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === "dark" ? "light" : "dark";
      localStorage.setItem("theme", newTheme);
      return { theme: newTheme };
    }),

  setTheme: (theme) => {
    localStorage.setItem("theme", theme);
    set({ theme });
  },
}));