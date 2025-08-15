"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
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

export default function TechStack() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % techCategories.length)
    }, 2000) // Change every 2 seconds

    return () => clearInterval(interval)
  }, [])

  const currentTech = techCategories[currentIndex]

  return (
    <div
      className="bg-card border border-border rounded-xl p-3 sm:p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="text-center">
        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-foreground mb-2 sm:mb-3 md:mb-4">Tech Stack</h3>
        
        <div className="flex flex-col items-center justify-center min-h-[80px] sm:min-h-[100px] md:min-h-[120px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              transition={{ 
                duration: 0.5,
                ease: "easeInOut"
              }}
              className="flex flex-col items-center"
            >
              {/* Icon */}
              <motion.div
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6,
                  ease: "easeOut",
                  delay: 0.1
                }}
                className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-2 sm:mb-3 ${currentTech.color}`}
              >
                <currentTech.icon />
              </motion.div>
              
              {/* Technology Name */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.4,
                  delay: 0.2
                }}
                className="text-xs sm:text-sm text-muted-foreground"
              >
                {currentTech.name}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
