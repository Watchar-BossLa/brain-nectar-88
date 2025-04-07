import React, { createContext, useContext, useEffect, useState } from 'react';

/**
 * @typedef {'light'|'dark'|'system'} ThemeMode
 */

/**
 * @typedef {Object} ThemeState
 * @property {ThemeMode} mode - The theme mode
 * @property {boolean} highContrast - Whether high contrast mode is enabled
 */

/**
 * @typedef {Object} ThemeContextType
 * @property {ThemeState} theme - The current theme state
 * @property {Function} setTheme - Function to set the theme
 * @property {Function} setMode - Function to set the theme mode
 * @property {Function} toggleHighContrast - Function to toggle high contrast mode
 */

/**
 * Initial theme state
 * @type {ThemeState}
 */
const initialTheme = {
  mode: 'system',
  highContrast: false,
};

/**
 * Theme context
 * @type {React.Context<ThemeContextType|undefined>}
 */
const ThemeContext = createContext(undefined);

/**
 * Theme provider component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {React.ReactElement} Theme provider component
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
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
    
    /**
     * Handle system preference changes
     * @param {MediaQueryListEvent} e - Media query event
     */
    const handleSystemPreferenceChange = (e) => {
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

  /**
   * Set the theme mode
   * @param {ThemeMode} mode - The theme mode to set
   */
  const setMode = (mode) => {
    setTheme({ ...theme, mode });
  };

  /**
   * Toggle high contrast mode
   */
  const toggleHighContrast = () => {
    setTheme({ ...theme, highContrast: !theme.highContrast });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, setMode, toggleHighContrast }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook for accessing theme context
 * @returns {ThemeContextType} Theme context
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
