"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./ThemeToggle"
import { useCallback } from "react"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/experience", label: "Experiences" },
  { href: "/contact", label: "Contact" },
  { href: "/blog", label: "Blog" },
]

export default function Navbar() {
  const pathname = usePathname()

  const handleBlogHover = useCallback(async () => {
    try {
      const { getBlogPosts } = await import("@/lib/notion")
      await getBlogPosts()
    } catch {
      // non-critical prefetch
    }
  }, [])

  return (
    <header className="fixed top-0 left-0 z-[100] w-full bg-background text-foreground border-b border-border">
      <div className="mx-auto flex w-full max-w-8xl flex-col px-3 py-2 sm:grid sm:h-14 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:gap-0 sm:px-0 sm:py-0">
        <div className="flex items-center justify-between sm:contents">
          {/* left */}
          <Button asChild variant="ghost" size="sm" className="shrink-0 px-2 relative z-10 sm:col-start-1 sm:row-start-1 sm:px-10">
            <Link href="/" aria-label="Go to homepage" className="text-base font-bold tracking-wide">
              KS
            </Link>
          </Button>

          {/* right */}
          <div className="shrink-0 flex items-center gap-2 whitespace-nowrap relative z-10 sm:col-start-3 sm:row-start-1 sm:justify-self-end sm:gap-4 sm:px-10">
            <ThemeToggle />

            <Button asChild size="sm" variant="outline">
              <a href="/kevin-saji-resume.pdf" download>
                <span className="hidden sm:inline">Download </span>Résumé
              </a>
            </Button>
          </div>
        </div>

        {/* center */}
        <nav className="mt-2 min-w-0 sm:col-start-1 sm:col-end-4 sm:row-start-1 sm:mt-0 sm:justify-self-center" aria-label="Primary">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide sm:justify-center sm:gap-10">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/blog"
                  ? pathname.startsWith("/blog")
                  : pathname === link.href || pathname.startsWith(`${link.href}/`)

              return (
                <Button
                  key={link.href}
                  asChild
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-9 shrink-0 rounded-none border-b-2 border-transparent px-2 text-xs sm:px-6 sm:text-sm",
                    "text-muted-foreground",
                    isActive && "border-foreground text-foreground"
                  )}
                >
                  <Link
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    onMouseEnter={link.href === "/blog" ? handleBlogHover : undefined}
                    className="whitespace-nowrap"
                  >
                    {link.label}
                  </Link>
                </Button>
              )
            })}
          </div>
        </nav>
      </div>
    </header>
  )
}