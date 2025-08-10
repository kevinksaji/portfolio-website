"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function VisitorsCount() {
  const [visitorCount, setVisitorCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVisitorCount = async () => {
      try {
        // Try to fetch from your deployed site's API route first
        const response = await fetch('https://kevin-saji.vercel.app/api/analytics/visitors')
        if (response.ok) {
          const data = await response.json()
          setVisitorCount(data.visitors)
          console.log('✅ Successfully fetched visitor count from deployed site:', data.visitors)
        } else {
          console.warn('Failed to fetch visitor count from deployed site API')
          // Fallback to localStorage
          const storedCount = localStorage.getItem('websiteVisitors')
          if (storedCount) {
            setVisitorCount(parseInt(storedCount))
          }
        }
      } catch (error) {
        console.warn('Error fetching visitor count from deployed site:', error)
        // Fallback to localStorage
        const storedCount = localStorage.getItem('websiteVisitors')
        if (storedCount) {
          setVisitorCount(parseInt(storedCount))
        }
      } finally {
        setLoading(false)
      }
    }

    fetchVisitorCount()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-card border border-border rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-4">Website Visitors</h3>
        
        <div className="text-center">
          {loading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-8 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-20 mx-auto"></div>
            </div>
          ) : (
            <>
              <div className="text-3xl font-bold text-foreground">
                {visitorCount.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Visitors
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}
