"use client"

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  SiC,
  SiPython,
  SiMysql,
  SiGo,
  SiReact,
  SiReactrouter,
  SiVuedotjs,
  SiSpringboot,
  SiFlask,
  SiFirebase,
  SiSupabase,
  SiAmazonwebservices,
  SiAngular,
  SiTypescript,
  SiJavascript
} from 'react-icons/si'
import { DiJava, DiDatabase } from 'react-icons/di'
import { cn } from '@/lib/utils'

interface TechCategory {
  name: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

const techCategories: TechCategory[] = [
  // Programming Languages
  { name: 'C', icon: SiC, color: 'text-blue-600' },
  { name: 'Java', icon: DiJava, color: 'text-red-500' },
  { name: 'Python', icon: SiPython, color: 'text-blue-500' },
  { name: 'JavaScript', icon: SiJavascript, color: 'text-yellow-500' },
  { name: 'TypeScript', icon: SiTypescript, color: 'text-blue-600' },
  { name: 'SQL', icon: DiDatabase, color: 'text-blue-700' },
  { name: 'Golang', icon: SiGo, color: 'text-cyan-500' },

  // Frontend Frameworks
  { name: 'React.js', icon: SiReact, color: 'text-cyan-400' },
  { name: 'React Native', icon: SiReactrouter, color: 'text-blue-400' },
  { name: 'Vue.js', icon: SiVuedotjs, color: 'text-green-500' },
  { name: 'Angular', icon: SiAngular, color: 'text-red-600' },
  { name: 'Spring Boot', icon: SiSpringboot, color: 'text-green-600' },
  { name: 'Flask', icon: SiFlask, color: 'text-gray-800' },

  // Backend & Cloud
  { name: 'Firebase', icon: SiFirebase, color: 'text-orange-500' },
  { name: 'Supabase', icon: SiSupabase, color: 'text-green-500' },
  { name: 'MySQL', icon: SiMysql, color: 'text-blue-600' },
  { name: 'AWS', icon: SiAmazonwebservices, color: 'text-orange-500' }
]

type Props = {
  className?: string
}

export default function TechStack({ className }: Props) {
  const categories = useMemo(() => techCategories, [])
  const [activeIndex, setActiveIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [reduceMotion, setReduceMotion] = useState(false)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduceMotion(mediaQuery.matches)
    update()

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', update)
      return () => mediaQuery.removeEventListener('change', update)
    }

    mediaQuery.addListener(update)
    return () => mediaQuery.removeListener(update)
  }, [])

  useEffect(() => {
    if (reduceMotion) {
      setIsVisible(true)
      return
    }
    if (categories.length <= 1) return

    const intervalId = window.setInterval(() => {
      setIsVisible(false)

      if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
      timeoutRef.current = window.setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % categories.length)
        setIsVisible(true)
      }, 160)
    }, 2200)

    return () => {
      window.clearInterval(intervalId)
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    }
  }, [categories.length, reduceMotion])

  const activeTech = categories[activeIndex] ?? categories[0]
  const Icon = activeTech?.icon

  return (
    <div
      className={cn(
        "bg-card border border-border rounded-xl p-3 sm:p-4 md:p-5 lg:p-5 shadow-lg hover:shadow-xl transition-all duration-300",
        className
      )}
    >
      <div className="h-full flex flex-col justify-center text-center">
        <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-foreground mb-2 sm:mb-3">Tech Stack</h3>

        {activeTech && Icon ? (
          <div
            className={cn(
              "flex flex-col items-center justify-center",
              "transition-opacity duration-500 motion-reduce:transition-none",
              isVisible ? "opacity-100" : "opacity-0"
            )}
          >
            <div className={cn("text-5xl sm:text-6xl md:text-7xl", activeTech.color)}>
              <Icon />
            </div>
            <div className="mt-2 text-sm sm:text-base text-muted-foreground">
              {activeTech.name}
            </div>
          </div>
        ) : (
          <div className="text-xs sm:text-sm text-muted-foreground">—</div>
        )}
      </div>
    </div>
  )
}
