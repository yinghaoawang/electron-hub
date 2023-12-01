import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction
} from 'react';

type ThemeContent = {
  theme: Theme;
  setTheme: Dispatch<SetStateAction<Theme>>;
  resetToSystemTheme: () => Promise<Theme>;
  toggleTheme: () => Promise<Theme>;
};

const ThemeContext = createContext<ThemeContent>(null);
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const resetToSystemTheme = async () => {
    const isDarkMode = (await window.darkMode.reset()) ? 'dark' : 'light';
    setTheme(isDarkMode);
    return isDarkMode;
  };
  const toggleTheme = async () => {
    const isDarkMode = (await window.darkMode.toggle()) ? 'dark' : 'light';
    setTheme(isDarkMode);
    return isDarkMode;
  };
  const [theme, setTheme] = useState<Theme>(null);
  const value: ThemeContent = {
    theme,
    setTheme,
    resetToSystemTheme,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
export function useTheme() {
  return useContext(ThemeContext);
}
