import {
  createContext,
  useContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction
} from 'react';

export type Theme = 'dark' | 'light';

type ThemeContent = {
  theme: Theme;
  setTheme: Dispatch<SetStateAction<Theme>>;
  resetToSystemTheme: () => Promise<Theme>;
  toggleTheme: () => Promise<Theme>;
};

const ThemeContext = createContext<ThemeContent>(null);
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const resetToSystemTheme = async () => {
    const isDarkMode = (await window.darkMode.system()) ? 'dark' : 'light';
    setTheme(isDarkMode);
    return isDarkMode;
  };
  const toggleTheme = async () => {
    const isDarkMode = (await window.darkMode.toggle()) ? 'dark' : 'light';
    setTheme(isDarkMode);
    return isDarkMode;
  };
  const [theme, setTheme] = useState<Theme>(null);

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, resetToSystemTheme, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
export function useTheme() {
  return useContext(ThemeContext);
}
