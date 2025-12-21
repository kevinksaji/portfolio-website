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
    <header className="fixed top-0 left-0 z-[100] h-14 w-full bg-background text-foreground border-b border-border">
      <div className="mx-auto grid h-full w-full max-w-8xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-0 px-0">
        {/* left */}
        <Button asChild variant="ghost" size="sm" className="col-start-1 row-start-1 shrink-0 px-10 relative z-10">
          <Link href="/" aria-label="Go to homepage" className="text-base font-bold tracking-wide">
            KS
          </Link>
        </Button>

        {/* center */}
        <nav className="col-start-1 col-end-4 row-start-1 min-w-0 justify-self-center" aria-label="Primary">
          <div className="flex items-center justify-center gap-8 overflow-x-auto scrollbar-hide sm:gap-10">
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
                    "h-9 rounded-none border-b-2 border-transparent px-3 text-xs sm:px-6 sm:text-sm",
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

        {/* right */}
        <div className="col-start-3 row-start-1 justify-self-end shrink-0 flex items-center gap-3 whitespace-nowrap relative z-10 sm:gap-4 px-10">
          <ThemeToggle />

          <Button asChild size="sm" variant="outline">
            <Link href="/kevin-saji-resume.pdf" download>
              <span className="hidden sm:inline">Download </span>Résumé
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}