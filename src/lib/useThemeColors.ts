'use client';

import { useEffect, useState } from 'react';
import { colors, applyThemeColors, updateColor, updateColors, resetColors } from './colorUtils';

export const useThemeColors = () => {
  const [isDark, setIsDark] = useState(false);

  // Initialize theme colors on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    let initialDarkMode = false;
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      initialDarkMode = true;
    }
    
    setIsDark(initialDarkMode);
    setTheme(initialDarkMode);
  }, []);

  // Function to toggle theme
  const toggleTheme = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    
    const root = document.documentElement;
    if (newDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    applyThemeColors(newDarkMode);
  };

  // Function to set specific theme
  const setTheme = (darkMode: boolean) => {
    setIsDark(darkMode);
    
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    applyThemeColors(darkMode);
  };

  // Function to update a single color
  const updateSingleColor = (
    colorKey: keyof typeof colors.light,
    lightValue: string,
    darkValue: string
  ) => {
    updateColor(colorKey, lightValue, darkValue);
  };

  // Function to update multiple colors
  const updateMultipleColors = (updates: Partial<{
    [K in keyof typeof colors.light]: {
      light: string;
      dark: string;
    };
  }>) => {
    updateColors(updates);
  };

  // Function to reset to default colors
  const resetToDefaults = () => {
    resetColors();
  };

  // Get current color value
  const getCurrentColor = (colorKey: keyof typeof colors.light) => {
    return isDark ? colors.dark[colorKey] : colors.light[colorKey];
  };

  return {
    isDark,
    colors: isDark ? colors.dark : colors.light,
    lightColors: colors.light,
    darkColors: colors.dark,
    toggleTheme,
    setTheme,
    updateSingleColor,
    updateMultipleColors,
    resetToDefaults,
    getCurrentColor,
  };
};
