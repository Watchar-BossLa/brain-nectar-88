
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Make sure we're passing a valid theme string that matches the expected type
  const validatedProps = {
    ...props,
    defaultTheme: (props.defaultTheme || 'system') as 'system' | 'light' | 'dark',
  };
  return <NextThemesProvider {...validatedProps}>{children}</NextThemesProvider>
}
