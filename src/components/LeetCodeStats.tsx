"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LeetCodeStats {
  totalSolved: number
  easy: number
  medium: number
  hard: number
}

export default function LeetCodeStats() {
  const stats: LeetCodeStats = {
    totalSolved: 168,
    easy: 93,
    medium: 73,
    hard: 2
  }
  const [currentDifficulty, setCurrentDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy')

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDifficulty(prev => {
        if (prev === 'easy') return 'medium'
        if (prev === 'medium') return 'hard'
        return 'easy'
      })
    }, 3000) // Change every 3 seconds

    return () => clearInterval(interval)
  }, [])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-500'
      case 'Medium': return 'text-yellow-500'
      case 'Hard': return 'text-red-500'
      default: return 'text-foreground'
    }
  }

  const getDifficultyLabel = (difficulty: 'easy' | 'medium' | 'hard') => {
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-card border border-border rounded-xl p-3 sm:p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="text-center">
        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-foreground mb-2 sm:mb-3 md:mb-4">
          LeetCode
        </h3>
        
        <div className="space-y-2 sm:space-y-3 md:space-y-4">
          <div className="flex items-start justify-center gap-4 sm:gap-6 md:gap-8">
            <div className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                {stats.totalSolved}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Solved
              </div>
            </div>
            
            <div className="text-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentDifficulty}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="w-12 sm:w-14 md:w-16"
                >
                  <div className={`text-xl sm:text-2xl md:text-3xl font-bold ${getDifficultyColor(getDifficultyLabel(currentDifficulty))}`}>
                    {stats[currentDifficulty as keyof LeetCodeStats]}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    {getDifficultyLabel(currentDifficulty)}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Remove the old dots section */}
      </div>
    </motion.div>
  )
}
