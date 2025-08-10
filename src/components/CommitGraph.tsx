"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface ContributionDay {
  date: string
  contributionCount: number
  color: string
}

interface ContributionWeek {
  contributionDays: ContributionDay[]
}

export default function CommitGraph() {
  const [contributions, setContributions] = useState<ContributionWeek[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalContributions, setTotalContributions] = useState(0)

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        setLoading(true)
        
        // Check for cached contributions
        const cached = localStorage.getItem('githubContributionsCache')
        if (cached) {
          const cachedData = JSON.parse(cached)
          const now = Date.now()
          
          // Cache for 1 hour
          if (now < cachedData.timestamp + (60 * 60 * 1000)) {
            setContributions(cachedData.contributions)
            setTotalContributions(cachedData.totalContributions)
            setLoading(false)
            return
          }
        }
        
        // Get GitHub token from environment
        const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN
        
        // Prepare headers for API requests
        const headers: HeadersInit = {
          'Accept': 'application/vnd.github.v3+json'
        }
        
        if (token) {
          headers['Authorization'] = `token ${token}`
        }
        
        // Fetch contribution data using GitHub's GraphQL API
        const query = `
          query {
            user(login: "kevinksaji") {
              contributionsCollection {
                contributionCalendar {
                  totalContributions
                  weeks {
                    contributionDays {
                      contributionCount
                      date
                      color
                    }
                  }
                }
              }
            }
          }
        `
        
        const response = await fetch('https://api.github.com/graphql', {
          method: 'POST',
          headers: {
            ...headers,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query })
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch contribution data')
        }
        
        const data = await response.json()
        
        if (data.errors) {
          throw new Error(data.errors[0].message)
        }
        
        const user = data.data.user
        if (!user || !user.contributionsCollection) {
          throw new Error('No contribution data found')
        }
        
        const calendar = user.contributionsCollection.contributionCalendar
        const weeks = calendar.weeks
        const total = calendar.totalContributions
        
        setContributions(weeks)
        setTotalContributions(total)
        
        // Cache the results
        const cacheData = {
          contributions: weeks,
          totalContributions: total,
          timestamp: Date.now()
        }
        localStorage.setItem('githubContributionsCache', JSON.stringify(cacheData))
        
      } catch (error) {
        console.error('Error fetching contributions:', error)
        setError('Failed to load commit graph')
      } finally {
        setLoading(false)
      }
    }

    fetchContributions()
  }, [])

  const getContributionColor = (count: number): string => {
    if (count === 0) return 'bg-gray-100 dark:bg-gray-800'
    if (count <= 3) return 'bg-green-200 dark:bg-green-800'
    if (count <= 6) return 'bg-green-400 dark:bg-green-600'
    if (count <= 9) return 'bg-green-600 dark:bg-green-400'
    return 'bg-green-800 dark:bg-green-200'
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-card border border-border rounded-xl p-6 shadow-lg"
      >
        <div className="text-center">
          <h3 className="text-lg font-semibold text-muted-foreground mb-4">
            Commit Graph
          </h3>
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-card border border-border rounded-xl p-6 shadow-lg"
      >
        <div className="text-center">
          <h3 className="text-lg font-semibold text-muted-foreground mb-4">
            Commit Graph
          </h3>
          <div className="text-sm text-muted-foreground">{error}</div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-card border border-border rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="text-center">
        <h3 className="text-lg font-semibold text-muted-foreground mb-4">
          Commit Graph
        </h3>
        
        <div className="mb-4">
          <div className="text-2xl font-bold text-foreground">
            {totalContributions.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">
            contributions this year
          </div>
        </div>
        
        <div className="flex justify-center">
          <div className="grid grid-cols-53 gap-1">
            {contributions.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.contributionDays.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={`w-2 h-2 rounded-sm ${getContributionColor(day.contributionCount)}`}
                    title={`${day.date}: ${day.contributionCount} contributions`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-center items-center gap-4 mt-4 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-sm bg-gray-100 dark:bg-gray-800"></div>
            <div className="w-2 h-2 rounded-sm bg-green-200 dark:bg-green-800"></div>
            <div className="w-2 h-2 rounded-sm bg-green-400 dark:bg-green-600"></div>
            <div className="w-2 h-2 rounded-sm bg-green-600 dark:bg-green-400"></div>
            <div className="w-2 h-2 rounded-sm bg-green-800 dark:bg-green-200"></div>
          </div>
          <span>More</span>
        </div>
      </div>
    </motion.div>
  )
}
