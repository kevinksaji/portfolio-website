import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next"
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/NavBar";
import { GitHubProvider } from "@/lib/GitHubContext";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "kev.ai",
  description: "Kevin's Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Apply theme immediately to prevent any flash
                var root = document.documentElement;
                
                try {
                  // Get theme from localStorage or default to system preference
                  var theme = localStorage.getItem('ui-theme');
                  if (!theme || !['light', 'dark', 'system'].includes(theme)) {
                    var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                    theme = mediaQuery.matches ? 'dark' : 'light';
                    // Store the detected theme for consistency
                    try {
                      localStorage.setItem('ui-theme', theme);
                    } catch (e) {
                      // Ignore localStorage errors
                    }
                  }
                  
                  // Apply theme immediately to prevent flash
                  root.classList.remove('light', 'dark');
                  root.classList.add(theme);
                  root.style.colorScheme = theme;
                  
                  // Listen for system theme changes if using system theme
                  if (theme === 'system') {
                    var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                    var updateTheme = function(e) {
                      var newTheme = e.matches ? 'dark' : 'light';
                      root.classList.remove('light', 'dark');
                      root.classList.add(newTheme);
                      root.style.colorScheme = newTheme;
                    };
                    mediaQuery.addEventListener('change', updateTheme);
                  }
                } catch (e) {
                  // Fallback to light theme if anything fails
                  root.classList.remove('light', 'dark');
                  root.classList.add('light');
                  root.style.colorScheme = 'light';
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground transition-colors duration-300`}
        suppressHydrationWarning
      >
        <ThemeProvider
          defaultTheme="system"
          storageKey="ui-theme"
        >
          <Navbar/>
          <GitHubProvider>
            {children}
          </GitHubProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
