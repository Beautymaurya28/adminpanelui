import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';
type ThemeColor = 'indigo' | 'cyan' | 'emerald' | 'amber' | 'rose';

interface ThemeContextType {
  theme: Theme;
  themeColor: ThemeColor;
  toggleTheme: () => void;
  setThemeColor: (color: ThemeColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme as Theme) || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });
  
  const [themeColor, setThemeColor] = useState<ThemeColor>(() => {
    const savedColor = localStorage.getItem('themeColor');
    return (savedColor as ThemeColor) || 'indigo';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('themeColor', themeColor);
    const root = window.document.documentElement;
    root.setAttribute('data-theme-color', themeColor);
  }, [themeColor]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, themeColor, toggleTheme, setThemeColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};