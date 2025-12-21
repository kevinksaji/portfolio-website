"use client"

import { useGitHub } from '@/lib/GitHubContext'
import { cn } from '@/lib/utils'

type Props = {
  className?: string
}

export default function GitHubStats({ className }: Props) {
  const { stats, loading, error, rateLimitInfo } = useGitHub()

  if (loading) {
    return (
      <div
        className={cn(
          "bg-card border border-border rounded-xl p-3 sm:p-4 md:p-5 lg:p-5 shadow-lg hover:shadow-xl transition-all duration-300",
          className
        )}
      >
        <div className="h-full flex flex-col justify-center text-center">
          <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-foreground mb-3 sm:mb-4">GitHub</h3>

          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            {/* Stats section skeleton - matches exact layout */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 place-items-center">
              <div className="text-center">
                <div className="h-8 sm:h-9 md:h-10 bg-muted rounded animate-pulse mb-1"></div>
                <div className="h-3 sm:h-4 bg-muted rounded animate-pulse w-12 sm:w-14 md:w-16 mx-auto"></div>
              </div>

              <div className="text-center">
                <div className="h-8 sm:h-9 md:h-10 bg-muted rounded animate-pulse mb-1"></div>
                <div className="h-3 sm:h-4 bg-muted rounded animate-pulse w-10 sm:w-11 md:w-12 mx-auto"></div>
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
        className={cn(
          "bg-card border border-border rounded-xl p-3 sm:p-4 md:p-5 lg:p-5 shadow-lg hover:shadow-xl transition-all duration-300",
          className
        )}
      >
        <div className="h-full flex flex-col justify-center text-center">
          <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-foreground mb-3 sm:mb-4">GitHub</h3>
          <div className="text-red-500 text-xs sm:text-sm">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "bg-card border border-border rounded-xl p-3 sm:p-4 md:p-5 lg:p-5 shadow-lg hover:shadow-xl transition-all duration-300",
        className
      )}
    >
      <div className="h-full flex flex-col justify-center text-center">
        <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-foreground mb-3 sm:mb-4">GitHub</h3>

        {rateLimitInfo && (
          <div className="text-xs text-muted-foreground mb-2 sm:mb-3 md:mb-4 bg-muted px-2 py-1 rounded">
            {rateLimitInfo}
          </div>
        )}

        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 place-items-center">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                {typeof stats.totalCommits === "number" ? stats.totalCommits.toLocaleString() : "—"}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Commits
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                {stats.publicRepos}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Repos
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
