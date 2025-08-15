"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./ThemeToggle"

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()

  const onBack = () => {
    // Handle different routes intelligently
    if (pathname.startsWith("/contact/")) {
      router.push("/contact")
    } else if (pathname.startsWith("/about")) {
      router.push("/")
    } else if (pathname.startsWith("/experience")) {
      router.push("/")
    } else if (pathname.startsWith("/blog")) {
      router.push("/")
    } else {
      router.push("/")
    }
  }

  const isHome = pathname === "/"
  
  // Get page title based on current route
  const getPageTitle = () => {
    if (pathname.startsWith("/about")) return "About"
    if (pathname.startsWith("/experience")) return "Experiences"
    if (pathname.startsWith("/blog")) return "Blog"
    if (pathname.startsWith("/contact")) return "Contact"
    if (pathname.startsWith("/chat")) return "Chat"
    return ""
  }

  const pageTitle = getPageTitle()

  return (
    <header
      className="
        fixed top-0 left-0 z-[100] flex h-14 w-full
        items-center justify-between bg-background/95 backdrop-blur-md
        text-foreground border-b border-border/20
        px-6 shadow-sm
      "
    >
      {/* initials (always visible) */}
      <Link href="/" className="text-lg font-bold tracking-wide">
        KS
      </Link>

      {/* center - page title (only visible when not on home) */}
      {!isHome && pageTitle && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <h1 className="text-lg font-semibold text-foreground">
            {pageTitle}
          </h1>
        </div>
      )}

      {/* right side - theme toggle and navigation */}
      <div className="flex items-center space-x-4">
        {/* theme toggle */}
        <ThemeToggle />
        
        {/* right-hand button changes depending on route */}
        {isHome ? (
          <Link
            href="/kevinksaji_resume.pdf"
            download
          >
            <Button size="sm" variant="outline" className="
              border-border text-foreground
              hover:bg-accent hover:text-accent-foreground
            ">
              Download Résumé
            </Button>
          </Link>
        ) : (
          <Button size="sm" variant="outline" onClick={onBack} className="
            border-border text-foreground
            hover:bg-accent hover:text-accent-foreground
          ">
            ← Back
          </Button>
        )}
      </div>
    </header>
  )
}