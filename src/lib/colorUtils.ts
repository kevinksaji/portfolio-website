import { colors, cssVarNames } from './colors';

// Function to update a single color for both light and dark modes
export const updateColor = (
  colorKey: keyof typeof colors.light,
  lightValue: string,
  darkValue: string
) => {
  const cssVarName = cssVarNames[colorKey];
  if (!cssVarName) {
    console.warn(`Unknown color key: ${colorKey}`);
    return;
  }

  // Update the colors object
  colors.light[colorKey] = lightValue;
  colors.dark[colorKey] = darkValue;

  // Update CSS custom properties
  const root = document.documentElement;
  root.style.setProperty(cssVarName, lightValue);
  
  // If dark mode is active, also update the dark mode value
  if (root.classList.contains('dark')) {
    root.style.setProperty(cssVarName, darkValue);
  }
};

// Function to update multiple colors at once
export const updateColors = (updates: Partial<{
  [K in keyof typeof colors.light]: {
    light: string;
    dark: string;
  };
}>) => {
  Object.entries(updates).forEach(([colorKey, values]) => {
    updateColor(colorKey as keyof typeof colors.light, values.light, values.dark);
  });
};

// Function to get current color value
export const getCurrentColor = (colorKey: keyof typeof colors.light) => {
  const isDark = document.documentElement.classList.contains('dark');
  return isDark ? colors.dark[colorKey] : colors.light[colorKey];
};

// Function to reset colors to default values
export const resetColors = () => {
  const root = document.documentElement;
  const isDark = root.classList.contains('dark');
  
  // Reset all CSS custom properties to their default values
  Object.entries(cssVarNames).forEach(([key, cssVarName]) => {
    const colorKey = key as keyof typeof colors.light;
    const defaultValue = isDark ? colors.dark[colorKey] : colors.light[colorKey];
    root.style.setProperty(cssVarName, defaultValue);
  });
};

// Function to apply theme colors to document
export const applyThemeColors = (isDark: boolean) => {
  const root = document.documentElement;
  const themeColors = isDark ? colors.dark : colors.light;
  
  Object.entries(cssVarNames).forEach(([key, cssVarName]) => {
    const colorKey = key as keyof typeof colors.light;
    root.style.setProperty(cssVarName, themeColors[colorKey]);
  });
};

// Export the colors object for direct access
export { colors, cssVarNames };
