
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = {
  mode: 'light' | 'dark' | 'system';
  highContrast: boolean;
};

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: 'light' | 'dark' | 'system';
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setMode: (mode: 'light' | 'dark' | 'system') => void;
  toggleHighContrast: () => void;
};

const initialState: Theme = {
  mode: 'system',
  highContrast: false
};

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Only access localStorage if we're in a browser environment
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem(storageKey);
      if (storedTheme) {
        try {
          return JSON.parse(storedTheme);
        } catch (e) {
          console.error('Failed to parse theme from localStorage:', e);
        }
      }
    }
    
    return {
      ...initialState,
      mode: defaultTheme
    };
  });
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem(storageKey, JSON.stringify(theme));
    
    const root = window.document.documentElement;
    
    root.classList.remove('light', 'dark');
    
    if (theme.mode === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme.mode);
    }
    
    if (theme.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  }, [theme, storageKey]);
  
  const setMode = (mode: 'light' | 'dark' | 'system') => {
    setTheme(prev => ({
      ...prev,
      mode
    }));
  };
  
  const toggleHighContrast = () => {
    setTheme(prev => ({
      ...prev,
      highContrast: !prev.highContrast
    }));
  };
  
  return (
    <ThemeProviderContext.Provider
      value={{
        theme,
        setMode,
        toggleHighContrast
      }}
      {...props}
    >
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};
