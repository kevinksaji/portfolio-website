"use client"

import { motion } from 'framer-motion'
import { useGitHub } from '@/lib/GitHubContext'

export default function GitHubStats() {
  const { stats, contributions, loading, error, rateLimitInfo } = useGitHub()

  const getContributionColor = (count: number) => {
    if (count === 0) return 'bg-gray-300 dark:bg-gray-600'
    if (count <= 3) return 'bg-emerald-200'
    if (count <= 6) return 'bg-emerald-400'
    if (count <= 9) return 'bg-emerald-600'
    return 'bg-emerald-800'
  }

  if (loading) {
    return (
      <div
        className="bg-card border border-border rounded-xl p-3 sm:p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <div className="text-center">
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-foreground mb-3 sm:mb-4 md:mb-6">GitHub</h3>
          
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            {/* Stats section skeleton - matches exact layout */}
            <div className="flex items-start justify-center gap-4 sm:gap-5 md:gap-6">
              <div className="text-center">
                <div className="h-7 sm:h-8 md:h-9 bg-muted rounded animate-pulse mb-1"></div>
                <div className="h-3 sm:h-4 bg-muted rounded animate-pulse w-12 sm:w-14 md:w-16 mx-auto"></div>
              </div>
              
              <div className="text-center">
                <div className="h-7 sm:h-8 md:h-9 bg-muted rounded animate-pulse mb-1"></div>
                <div className="h-3 sm:h-4 bg-muted rounded animate-pulse w-10 sm:w-11 md:w-12 mx-auto"></div>
              </div>
            </div>
            
            {/* Contribution graph section skeleton - matches exact layout */}
            <div className="border-t border-border pt-3 sm:pt-4 md:pt-6">
              <div className="text-center mb-2 sm:mb-3 md:mb-4">
                <div className="h-3 sm:h-4 bg-muted rounded animate-pulse w-24 sm:w-28 md:w-32 mx-auto mb-2 sm:mb-3"></div>
                <div className="flex justify-center">
                  <div className="grid grid-cols-35 gap-0.5">
                    {Array.from({ length: 365 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-1 sm:w-1.5 h-1 sm:h-1.5 bg-muted rounded-sm animate-pulse"
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center items-center gap-2 sm:gap-3 text-xs text-muted-foreground">
                <span className="h-2 sm:h-3 bg-muted rounded animate-pulse w-6 sm:w-8"></span>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="w-1 sm:w-1.5 h-1 sm:h-1.5 bg-muted rounded-sm animate-pulse"></div>
                  ))}
                </div>
                <span className="h-2 sm:h-3 bg-muted rounded animate-pulse w-6 sm:w-8"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div
        className="bg-card border border-border rounded-xl p-3 sm:p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <div className="text-center">
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-foreground mb-3 sm:mb-4 md:mb-6">GitHub</h3>
          <div className="text-red-500 text-xs sm:text-sm">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="bg-card border border-border rounded-xl p-3 sm:p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="text-center">
        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-foreground mb-3 sm:mb-4 md:mb-6">GitHub</h3>
        
        {rateLimitInfo && (
          <div className="text-xs text-muted-foreground mb-2 sm:mb-3 md:mb-4 bg-muted px-2 py-1 rounded">
            {rateLimitInfo}
          </div>
        )}
        
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          <div className="flex items-start justify-center gap-4 sm:gap-5 md:gap-6">
            <div className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                {stats.totalCommits.toLocaleString()}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Commits
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                {stats.publicRepos}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Repos
              </div>
            </div>
          </div>
          
          {/* Real GitHub Contribution Graph */}
          {contributions.length > 0 && (
            <div className="border-t border-border pt-3 sm:pt-4 md:pt-6">
              <div className="text-center mb-2 sm:mb-3 md:mb-4">
                <div className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">Contribution Graph</div>
                <div className="flex justify-center">
                  <div className="grid grid-cols-35 gap-0.5">
                    {contributions.map((day, i) => (
                      <div
                        key={i}
                        className={`w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-sm ${getContributionColor(day.contributionCount)}`}
                        title={`${day.date}: ${day.contributionCount} contributions`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center items-center gap-2 sm:gap-3 text-xs text-muted-foreground">
                <span>Less</span>
                <div className="flex gap-1">
                  <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-sm bg-gray-300 dark:bg-gray-600"></div>
                  <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-sm bg-emerald-200"></div>
                  <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-sm bg-emerald-400"></div>
                  <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-sm bg-emerald-600"></div>
                  <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-sm bg-emerald-800"></div>
                </div>
                <span>More</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
