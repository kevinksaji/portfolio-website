"use client"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "ui-theme",
  ...props
}: ThemeProviderProps) {
  // Always start with default theme to prevent hydration mismatch
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Get theme from localStorage immediately and synchronously
    let savedTheme: Theme | null = null
    try {
      savedTheme = localStorage.getItem(storageKey) as Theme
    } catch (error) {
      console.warn("localStorage not available, using default theme")
    }

    // Set the theme immediately if valid
    if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
      setTheme(savedTheme)
    }

    // Mark as mounted after theme is set
    setMounted(true)
  }, [storageKey])

  useEffect(() => {
    if (!mounted) return

    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"
      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme, mounted])

  const value = {
    theme: mounted ? theme : defaultTheme, // Always return default during SSR
    setTheme: (newTheme: Theme) => {
      if (mounted && ["light", "dark", "system"].includes(newTheme)) {
        try {
          localStorage.setItem(storageKey, newTheme)
          setTheme(newTheme)
        } catch (error) {
          console.warn("Could not save theme to localStorage")
          setTheme(newTheme)
        }
      }
    },
    mounted,
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
