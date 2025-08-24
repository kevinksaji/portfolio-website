"use client"

import Link from "next/link"
import { Button } from "./ui/button"
import { motion } from "framer-motion"
import { useCallback } from "react"

const links = [
  { href: "/about", label: "About" },
  { href: "/experience", label: "Experiences" },
  { href: "/contact", label: "Contact Me" },
  { href: "/blog", label: "Blog" },
]

export default function NavigationButtons() {
  // Prefetch blog data on hover
  const handleBlogHover = useCallback(async () => {
    try {
      console.log('🚀 Prefetching blog data on hover...');
      const { getBlogPosts } = await import('@/lib/notion');
      await getBlogPosts();
      console.log('✅ Blog data prefetched on hover');
    } catch (error) {
      console.log('⚠️ Blog hover prefetch failed (non-critical):', error);
    }
  }, []);

  return (
    <div className="grid w-full grid-cols-2 gap-2 sm:gap-3 md:gap-4">
      {links.map((link) => (
        <Link key={link.href} href={link.href}>
          <Button
            variant="outline"
            className="
              my-1 sm:my-1.5 md:my-2 w-full px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6
              border-border text-foreground
              hover:bg-accent hover:text-accent-foreground
              transition-all duration-300
              text-sm sm:text-base
            "
            onMouseEnter={link.label === "Blog" ? handleBlogHover : undefined}
          >
            {link.label === "About" ? (
              <motion.span layoutId="about-title">{link.label}</motion.span>
            ) : link.label === "Experiences" ? (
              <motion.span layoutId="experience-title">
                {link.label}
              </motion.span>
            ) : (
              link.label === "Contact Me" ? (
                <motion.span layoutId="contact-title">
                  {link.label}
                </motion.span>
              ) : link.label === "Blog" ? (
                <motion.span layoutId="blog-title">
                  {link.label}
                </motion.span>
              ) : link.label
            )}
          </Button>
        </Link>
      ))}
    </div>
  )
}