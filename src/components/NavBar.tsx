"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

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
        items-center justify-between bg-white/80 backdrop-blur
        px-6 shadow-sm
      "
    >
      {/* initials (always visible) */}
      <Link href="/" className="text-lg font-bold tracking-wide">
        KS
      </Link>

      {/* right-hand button changes depending on route */}
      {isHome ? (
        <Link
          href="/kevinksaji_resume.pdf"          /* ⬅ replace with your real file */
          download

        >
          <Button size="sm" variant="outline" className="
      border-black text-black         /* normal state */
      hover:bg-black hover:text-white /* hover state  */
    "
          >
            Download Résumé
          </Button>
        </Link>
      ) : (
        <Button size="sm" variant="outline" onClick={onBack}>
          ← Back
        </Button>
      )}
    </header>
  )
}