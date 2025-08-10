"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function ClickCounter() {
  const [clickCount, setClickCount] = useState(0)

  useEffect(() => {
    // Load click count from localStorage on component mount
    const savedCount = localStorage.getItem('websiteClickCount')
    if (savedCount) {
      setClickCount(parseInt(savedCount))
    }
  }, [])

  const handleClick = () => {
    const newCount = clickCount + 1
    setClickCount(newCount)
    localStorage.setItem('websiteClickCount', newCount.toString())
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-card border border-border rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
      onClick={handleClick}
    >
      <div className="text-center">
        <h3 className="text-lg font-semibold text-muted-foreground mb-4">
          Website Clicks
        </h3>
        
        <div className="text-3xl font-bold text-foreground mb-2">
          {clickCount}
        </div>
        
        <div className="text-sm text-muted-foreground">
          Click me!
        </div>
      </div>
    </motion.div>
  )
}
