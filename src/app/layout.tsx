import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { GitHubProvider } from "@/lib/GitHubContext";
import Navbar from "@/components/NavBar";
import { CacheInvalidator } from "@/components/CacheInvalidator";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
  variable: '--font-inter',
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const themeColor = [
  { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  { media: "(prefers-color-scheme: dark)", color: "#000000" },
];

export const metadata: Metadata = {
  title: "kev.ai",
  description: "Software Engineer passionate about building scalable applications and solving complex problems.",
  keywords: ["Software Engineer", "Full Stack Developer", "React", "Next.js", "TypeScript"],
  authors: [{ name: "Kevin Saji" }],
  creator: "Kevin Saji",
  publisher: "Kevin Saji",
  robots: "index, follow",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kevin-saji.vercel.app",
    title: "kev.ai",
    description: "Software Engineer passionate about building scalable applications and solving complex problems.",
    siteName: "Kevin Saji Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "kev.ai",
    description: "Software Engineer passionate about building scalable applications and solving complex problems.",
  },
  other: {
    "msapplication-TileColor": "#000000",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//api.github.com" />
        <link rel="dns-prefetch" href="//leetcode.com" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://api.github.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://leetcode.com" crossOrigin="anonymous" />
        
        {/* Performance meta tags */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Service Worker Registration with Update Handling */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                      
                      // Check for updates
                      registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New version available, force update
                            newWorker.postMessage({ type: 'SKIP_WAITING' });
                            window.location.reload();
                          }
                        });
                      });
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          defaultTheme="system"
          storageKey="ui-theme"
        >
          <GitHubProvider>
            <Navbar />
            {children}
            <CacheInvalidator />
          </GitHubProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
