"use client"

import Link from "next/link"
import { Button } from "./ui/button"
import { motion } from "framer-motion"

const links = [
  { href: "/about", label: "About" },
  { href: "/experience", label: "Experiences" },
  { href: "/contact", label: "Contact Me" },
  { href: "/donate", label: "Donations" },
]

export default function NavigationButtons() {
  return (
    <div className="grid w-full grid-cols-2 gap-4">
      {links.map((link) => (
        <Link key={link.href} href={link.href}>
          <Button
            variant="outline"
            className="
              my-2 w-full px-6 py-6
              border-black text-black              /* normal state  */
              hover:bg-black hover:text-white      /* hover state   */
              transition-colors
            "
          >
            {link.label === "About" ? (
              <motion.span layoutId="about-title">{link.label}</motion.span>
            ) : link.label === "Experiences" ? (
              <motion.span layoutId="experience-title">
                {link.label}
              </motion.span>
            ) : (
              link.label
            )}
          </Button>
        </Link>
      ))}
    </div>
  )
}