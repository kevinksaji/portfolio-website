"use client"

import { useMemo } from 'react'
import { cn } from '@/lib/utils'

interface LeetCodeStats {
  totalSolved: number
  easy: number
  medium: number
  hard: number
}

type Props = {
  className?: string
}

export default function LeetCodeStats({ className }: Props) {
  const stats: LeetCodeStats = useMemo(
    () => ({
      totalSolved: 168,
      easy: 93,
      medium: 73,
      hard: 2,
    }),
    []
  )

  return (
    <div
      className={cn(
        "bg-card border border-border rounded-xl p-3 sm:p-4 md:p-5 lg:p-5 shadow-lg hover:shadow-xl transition-all duration-300",
        className
      )}
    >
      <div className="h-full flex flex-col justify-center text-center">
        <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-foreground mb-2 sm:mb-3">
          LeetCode
        </h3>

        <div className="space-y-2 sm:space-y-3 md:space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-3 place-items-center">
            <div className="text-center col-span-2 sm:col-span-1">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                {stats.totalSolved}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Solved
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-500">
                {stats.easy}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">Easy</div>
            </div>

            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-500">
                {stats.medium}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">Medium</div>
            </div>

            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-500">
                {stats.hard}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">Hard</div>
            </div>
          </div>
        </div>

        {/* Remove the old dots section */}
      </div>
    </div>
  )
}
