"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import ThemeToggle from "./ThemeToggle"

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()

  const onBack = () => {
    router.push("/")
  }

  const isHome = pathname === "/"

  return (
    <header
      className="
        fixed top-0 left-0 z-[100] flex h-14 w-full
        items-center justify-between bg-background/80 backdrop-blur
        text-foreground
        px-6
      "
    >
      {/* initials (always visible) */}
      <Link href="/" className="text-lg font-bold tracking-wide">
        KS
      </Link>

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
              hover:bg-foreground hover:text-white
            ">
              Download Résumé
            </Button>
          </Link>
        ) : (
          <Button size="sm" variant="outline" onClick={onBack} className="
            border-border text-foreground
            hover:bg-foreground hover:text-white
          ">
            ← Back
          </Button>
        )}
      </div>
    </header>
  )
}