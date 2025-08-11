"use client"

import * as React from "react"
import { FaSun, FaMoon } from "react-icons/fa"
import { useTheme } from "./ThemeProvider"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme, mounted } = useTheme()

  // Don't render until theme is properly initialized to prevent flicker
  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 relative"
        disabled
      >
        <div className="w-[1.2rem] h-[1.2rem] animate-pulse bg-muted-foreground rounded" />
        <span className="sr-only">Loading theme</span>
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="h-9 w-9 relative"
    >
      {theme === "dark" ? (
        <FaSun className="h-[1.2rem] w-[1.2rem] text-yellow-500" />
      ) : (
        <FaMoon className="h-[1.2rem] w-[1.2rem] text-muted-foreground" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
