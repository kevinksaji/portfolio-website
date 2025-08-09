"use client"

import { FaSun, FaMoon } from "react-icons/fa"
import { useThemeColors } from "@/lib/useThemeColors"

export default function ThemeToggle() {
  const { isDark, setTheme } = useThemeColors()

  const toggleTheme = () => {
    const newTheme = !isDark
    localStorage.setItem("theme", newTheme ? "dark" : "light")
    setTheme(newTheme)
  }

  return (
    <button
      onClick={toggleTheme}
      className="
        p-2 rounded-lg
        bg-muted hover:bg-accent
        transition-colors duration-200
      "
      aria-label="Toggle theme"
    >
      {isDark ? (
        <FaSun className="w-5 h-5 text-yellow-500" />
      ) : (
        <FaMoon className="w-5 h-5 text-muted-foreground" />
      )}
    </button>
  )
}
