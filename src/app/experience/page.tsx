"use client"

import { useState, useEffect } from "react"
import experiences from "@/data/experiences"
import WorkExperience from "@/components/WorkExperience"

export default function ExperiencePage() {
  const [currentExperience, setCurrentExperience] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || isScrolling) return

    const distance = touchStart - touchEnd
    const isSwipeLeft = distance > 50
    const isSwipeRight = distance < -50

    if (isSwipeLeft && currentExperience < experiences.length - 1) {
      setCurrentExperience(currentExperience + 1)
      setIsScrolling(true)
      setTimeout(() => setIsScrolling(false), 350)
    } else if (isSwipeRight && currentExperience > 0) {
      setCurrentExperience(currentExperience - 1)
      setIsScrolling(true)
      setTimeout(() => setIsScrolling(false), 350)
    }

    setTouchStart(0)
    setTouchEnd(0)
  }

  const onWheel = (e: React.WheelEvent) => {
    if (isScrolling) return

    const dominantDelta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY

    if (dominantDelta > 0 && currentExperience < experiences.length - 1) {
      setCurrentExperience(currentExperience + 1)
      setIsScrolling(true)
      setTimeout(() => setIsScrolling(false), 350)
    } else if (dominantDelta < 0 && currentExperience > 0) {
      setCurrentExperience(currentExperience - 1)
      setIsScrolling(true)
      setTimeout(() => setIsScrolling(false), 350)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling) return

      if (e.key === "ArrowRight" && currentExperience < experiences.length - 1) {
        setCurrentExperience(currentExperience + 1)
        setIsScrolling(true)
        setTimeout(() => setIsScrolling(false), 350)
      } else if (e.key === "ArrowLeft" && currentExperience > 0) {
        setCurrentExperience(currentExperience - 1)
        setIsScrolling(true)
        setTimeout(() => setIsScrolling(false), 350)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentExperience, isScrolling])

  return (
    <div
      className="h-[calc(100dvh-3.5rem)] w-full bg-background overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onWheel={onWheel}
    >
      <div className="fixed right-4 top-1/2 z-50 hidden -translate-y-1/2 gap-2 md:flex md:flex-col">
        {experiences.map((_, index) => (
          <div
            key={index}
            className={`h-3 w-3 rounded-full transition-all duration-300 ${index === currentExperience ? "bg-foreground scale-125" : "bg-muted-foreground/30"}`}
          />
        ))}
      </div>

      <div className="flex h-full items-center justify-center px-3 py-3 sm:px-6 sm:py-6">
        <div className="w-full max-w-5xl">
          <WorkExperience {...experiences[currentExperience]} />
        </div>
      </div>
    </div>
  )
}
