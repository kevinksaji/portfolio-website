// Global color configuration for light and dark modes
export const colors = {
  light: {
    // Base colors - Pure white theme
    background: 'oklch(1 0 0)', // Pure white
    foreground: 'oklch(0 0 0)', // Pure black
    
    // Card colors
    card: 'oklch(1 0 0)', // Pure white
    cardForeground: 'oklch(0 0 0)', // Pure black
    
    // Popover colors
    popover: 'oklch(1 0 0)', // Pure white
    popoverForeground: 'oklch(0 0 0)', // Pure black
    
    // Primary colors
    primary: 'oklch(0 0 0)', // Pure black
    primaryForeground: 'oklch(1 0 0)', // Pure white
    
    // Secondary colors
    secondary: 'oklch(0.95 0 0)', // Very light gray
    secondaryForeground: 'oklch(0 0 0)', // Pure black
    
    // Muted colors
    muted: 'oklch(0.95 0 0)', // Very light gray
    mutedForeground: 'oklch(0.4 0 0)', // Medium gray
    
    // Accent colors
    accent: 'oklch(0.95 0 0)', // Very light gray
    accentForeground: 'oklch(0 0 0)', // Pure black
    
    // Destructive colors
    destructive: 'oklch(0.577 0.245 27.325)', // Red
    
    // Border and input colors
    border: 'oklch(0.9 0 0)', // Light gray
    input: 'oklch(0.9 0 0)', // Light gray
    ring: 'oklch(0 0 0)', // Pure black
    
    // Chart colors
    chart1: 'oklch(0.646 0.222 41.116)', // Blue
    chart2: 'oklch(0.6 0.118 184.704)', // Teal
    chart3: 'oklch(0.398 0.07 227.392)', // Purple
    chart4: 'oklch(0.828 0.189 84.429)', // Orange
    chart5: 'oklch(0.769 0.188 70.08)', // Yellow
    
    // Sidebar colors
    sidebar: 'oklch(1 0 0)', // Pure white
    sidebarForeground: 'oklch(0 0 0)', // Pure black
    sidebarPrimary: 'oklch(0 0 0)', // Pure black
    sidebarPrimaryForeground: 'oklch(1 0 0)', // Pure white
    sidebarAccent: 'oklch(0.95 0 0)', // Very light gray
    sidebarAccentForeground: 'oklch(0 0 0)', // Pure black
    sidebarBorder: 'oklch(0.9 0 0)', // Light gray
    sidebarRing: 'oklch(0 0 0)', // Pure black
  },
  
  dark: {
    // Base colors - Pure black theme
    background: 'oklch(0 0 0)', // Pure black
    foreground: 'oklch(1 0 0)', // Pure white
    
    // Card colors
    card: 'oklch(0.05 0 0)', // Very dark gray
    cardForeground: 'oklch(1 0 0)', // Pure white
    
    // Popover colors
    popover: 'oklch(0.05 0 0)', // Very dark gray
    popoverForeground: 'oklch(1 0 0)', // Pure white
    
    // Primary colors
    primary: 'oklch(1 0 0)', // Pure white
    primaryForeground: 'oklch(0 0 0)', // Pure black
    
    // Secondary colors
    secondary: 'oklch(0.1 0 0)', // Dark gray
    secondaryForeground: 'oklch(1 0 0)', // Pure white
    
    // Muted colors
    muted: 'oklch(0.1 0 0)', // Dark gray
    mutedForeground: 'oklch(0.7 0 0)', // Light gray
    
    // Accent colors
    accent: 'oklch(0.1 0 0)', // Dark gray
    accentForeground: 'oklch(1 0 0)', // Pure white
    
    // Destructive colors
    destructive: 'oklch(0.704 0.191 22.216)', // Dark red
    
    // Border and input colors
    border: 'oklch(0.2 0 0)', // Medium gray
    input: 'oklch(0.2 0 0)', // Medium gray
    ring: 'oklch(1 0 0)', // Pure white
    
    // Chart colors
    chart1: 'oklch(0.488 0.243 264.376)', // Purple
    chart2: 'oklch(0.696 0.17 162.48)', // Teal
    chart3: 'oklch(0.769 0.188 70.08)', // Yellow
    chart4: 'oklch(0.627 0.265 303.9)', // Pink
    chart5: 'oklch(0.645 0.246 16.439)', // Orange
    
    // Sidebar colors
    sidebar: 'oklch(0.05 0 0)', // Very dark gray
    sidebarForeground: 'oklch(1 0 0)', // Pure white
    sidebarPrimary: 'oklch(1 0 0)', // Pure white
    sidebarPrimaryForeground: 'oklch(0 0 0)', // Pure black
    sidebarAccent: 'oklch(0.1 0 0)', // Dark gray
    sidebarAccentForeground: 'oklch(1 0 0)', // Pure white
    sidebarBorder: 'oklch(0.2 0 0)', // Medium gray
    sidebarRing: 'oklch(1 0 0)', // Pure white
  }
};

// Helper function to get color value
export const getColor = (mode: 'light' | 'dark', colorKey: keyof typeof colors.light) => {
  return colors[mode][colorKey];
};

// CSS custom property names
export const cssVarNames = {
  background: '--background',
  foreground: '--foreground',
  card: '--card',
  cardForeground: '--card-foreground',
  popover: '--popover',
  popoverForeground: '--popover-foreground',
  primary: '--primary',
  primaryForeground: '--primary-foreground',
  secondary: '--secondary',
  secondaryForeground: '--secondary-foreground',
  muted: '--muted',
  mutedForeground: '--muted-foreground',
  accent: '--accent',
  accentForeground: '--accent-foreground',
  destructive: '--destructive',
  border: '--border',
  input: '--input',
  ring: '--ring',
  chart1: '--chart-1',
  chart2: '--chart-2',
  chart3: '--chart-3',
  chart4: '--chart-4',
  chart5: '--chart-5',
  sidebar: '--sidebar',
  sidebarForeground: '--sidebar-foreground',
  sidebarPrimary: '--sidebar-primary',
  sidebarPrimaryForeground: '--sidebar-primary-foreground',
  sidebarAccent: '--sidebar-accent',
  sidebarAccentForeground: '--sidebar-accent-foreground',
  sidebarBorder: '--sidebar-border',
  sidebarRing: '--sidebar-ring',
} as const;
