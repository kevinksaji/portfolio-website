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

  // Listen for theme changes from other components
  useEffect(() => {
    const handleStorageChange = () => {
      const savedTheme = localStorage.getItem("theme");
      const newDarkMode = savedTheme === "dark";
      setIsDark(newDarkMode);
      setTheme(newDarkMode);
    };

    const handleClassChange = () => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setIsDark(isDarkMode);
    };

    // Listen for localStorage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Listen for class changes on the document
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          handleClassChange();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      observer.disconnect();
    };
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
    
    localStorage.setItem("theme", newDarkMode ? "dark" : "light");
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
    
    localStorage.setItem("theme", darkMode ? "dark" : "light");
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
