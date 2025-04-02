
import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';
type ThemeState = {
  mode: ThemeMode;
  highContrast: boolean;
};

interface ThemeContextType {
  theme: ThemeState;
  setTheme: (theme: ThemeState) => void;
  setMode: (mode: ThemeMode) => void;
  toggleHighContrast: () => void;
}

const initialTheme: ThemeState = {
  mode: 'system',
  highContrast: false,
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeState>(() => {
    // Try to get the theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? JSON.parse(savedTheme) : initialTheme;
  });

  // Update theme in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(theme));
  }, [theme]);

  // Apply the theme to the document
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all previous theme classes
    root.classList.remove('light', 'dark', 'high-contrast');
    
    // Apply mode
    if (theme.mode === 'system') {
      const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'dark' 
        : 'light';
      root.classList.add(systemPreference);
    } else {
      root.classList.add(theme.mode);
    }
    
    // Apply high contrast if enabled
    if (theme.highContrast) {
      root.classList.add('high-contrast');
    }
  }, [theme]);

  // Listen for system preference changes
  useEffect(() => {
    if (theme.mode !== 'system') return;
    
    const handleSystemPreferenceChange = (e: MediaQueryListEvent) => {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(e.matches ? 'dark' : 'light');
    };
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', handleSystemPreferenceChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleSystemPreferenceChange);
    };
  }, [theme.mode]);

  const setMode = (mode: ThemeMode) => {
    setTheme({ ...theme, mode });
  };

  const toggleHighContrast = () => {
    setTheme({ ...theme, highContrast: !theme.highContrast });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, setMode, toggleHighContrast }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
