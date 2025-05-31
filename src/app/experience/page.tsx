"use client"

import { motion } from "framer-motion"
import experiences from "@/data/experiences"
import WorkExperience from "@/components/WorkExperience"

/* ────────────────────────────────────────────────────────── */
/* Shared-layout heading (morphs from the nav button)        */
/* ────────────────────────────────────────────────────────── */
const Heading = () => (
  <motion.h1
    layoutId="experience-title"
    className="
      fixed left-1/2 top-16 sm:top-20 md:top-24
      -translate-x-1/2 z-50
      text-4xl md:text-5xl font-bold text-gray-900
    "
    transition={{ type: "spring", stiffness: 120, damping: 14 }}
  >
    Experiences
  </motion.h1>
)

/* ────────────────────────────────────────────────────────── */
/* Page component                                            */
/* ────────────────────────────────────────────────────────── */
export default function ExperiencePage() {
  return (
    <main
      className="h-screen snap-y snap-mandatory overflow-y-scroll bg-white/50"
      style={{ scrollbarWidth: "none" }}
    >
      {/* Hide scrollbar in Chromium browsers */}
      <style jsx global>{`
        main::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <Heading />

      {/* Render each work experience section */}
      {experiences.map((exp, idx) => (
        <WorkExperience key={idx} {...exp} />
      ))}
    </main>
  )
}