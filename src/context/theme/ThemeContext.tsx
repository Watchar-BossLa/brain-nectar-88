
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

type Theme = {
  mode: 'light' | 'dark' | 'system';
  highContrast: boolean;
};

interface ThemeContextType {
  theme: Theme;
  setMode: (mode: 'light' | 'dark' | 'system') => void;
  toggleHighContrast: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>({
    mode: 'system',
    highContrast: false,
  });

  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');

  useEffect(() => {
    // Load theme settings from localStorage if available
    const savedTheme = localStorage.getItem('study-bee-theme');
    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme);
        setTheme(parsedTheme);
      } catch (e) {
        console.error('Error parsing saved theme:', e);
      }
    }
  }, []);

  useEffect(() => {
    // Update HTML element class based on theme settings
    const root = window.document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark', 'high-contrast');
    
    // Apply appropriate theme
    if (theme.mode === 'system') {
      root.classList.add(prefersDark ? 'dark' : 'light');
    } else {
      root.classList.add(theme.mode);
    }
    
    // Apply high contrast if needed
    if (theme.highContrast) {
      root.classList.add('high-contrast');
    }
    
    // Save settings to localStorage
    localStorage.setItem('study-bee-theme', JSON.stringify(theme));
  }, [theme, prefersDark]);

  const setMode = (mode: 'light' | 'dark' | 'system') => {
    setTheme(prev => ({ ...prev, mode }));
  };

  const toggleHighContrast = () => {
    setTheme(prev => ({ ...prev, highContrast: !prev.highContrast }));
  };

  return (
    <ThemeContext.Provider value={{ theme, setMode, toggleHighContrast }}>
      {children}
    </ThemeContext.Provider>
  );
};
