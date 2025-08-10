"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface GitHubStats {
  totalCommits: number
  publicRepos: number
  followers: number
}

interface CachedStats {
  stats: GitHubStats
  timestamp: number
  rateLimitReset: number
}

interface ContributionDay {
  contributionCount: number
  date: string
}

interface ContributionWeek {
  contributionDays: ContributionDay[]
}

interface ContributionData {
  user: {
    contributionsCollection: {
      contributionCalendar: {
        totalContributions: number
        weeks: ContributionWeek[]
      }
    }
  }
}

export default function GitHubStats() {
  const [stats, setStats] = useState<GitHubStats>({
    totalCommits: 0,
    publicRepos: 0,
    followers: 0
  })
  const [contributions, setContributions] = useState<ContributionDay[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rateLimitInfo, setRateLimitInfo] = useState<string | null>(null)

  useEffect(() => {
    const fetchGitHubStats = async () => {
      try {
        setLoading(true)
        
        
        
        // Get GitHub token from environment
        const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN
        
        // Prepare headers for API requests
        const headers: HeadersInit = {
          'Accept': 'application/vnd.github.v3+json'
        }
        
        if (token) {
          headers['Authorization'] = `token ${token}`
        }
        
        // Fetch user data
        const userResponse = await fetch('https://api.github.com/users/kevinksaji', { headers })
        if (!userResponse.ok) throw new Error('Failed to fetch user data')
        const userData = await userResponse.json()
        
        // Check rate limit headers
        const remaining = userResponse.headers.get('x-ratelimit-remaining')
        const reset = userResponse.headers.get('x-ratelimit-reset')
        
        console.log('GitHub API Rate Limit:', { remaining, reset })
        
        if (remaining === '0') {
          throw new Error('Rate limit exceeded')
        }
        
        // Only show rate limit warning if we're getting close (less than 10 requests remaining)
        if (remaining && parseInt(remaining) < 10) {
          setRateLimitInfo(`Rate limit low: ${remaining} requests remaining`)
        }
        
        // Fetch personal repositories
        const personalReposResponse = await fetch('https://api.github.com/users/kevinksaji/repos?per_page=100', { headers })
        if (!personalReposResponse.ok) throw new Error('Failed to fetch personal repos')
        const personalRepos = await personalReposResponse.json()
        
        // Fetch organization memberships (public endpoint - only shows public orgs)
        let orgs: any[] = []
        
        // Try public endpoint first
        const publicOrgsResponse = await fetch('https://api.github.com/users/kevinksaji/orgs', { headers })
        if (publicOrgsResponse.ok) {
          const publicOrgs = await publicOrgsResponse.json()
          console.log(`\n🏢 Public organizations found: ${publicOrgs.length}`)
          if (publicOrgs.length > 0) {
            publicOrgs.forEach((org: any) => console.log(`  - ${org.login} (${org.type || 'unknown type'})`))
          }
          orgs = publicOrgs
        }
        
        // If we have a token, also try the authenticated endpoint for private orgs
        if (token) {
          try {
            const authOrgsResponse = await fetch('https://api.github.com/user/orgs', { headers })
            if (authOrgsResponse.ok) {
              const authOrgs = await authOrgsResponse.json()
              console.log(`\n🔐 Authenticated organizations found: ${authOrgs.length}`)
              if (authOrgs.length > 0) {
                authOrgs.forEach((org: any) => console.log(`  - ${org.login} (${org.type || 'unknown type'})`))
              }
              
              // Merge and deduplicate orgs
              const allOrgs = [...orgs, ...authOrgs]
              const uniqueOrgs = allOrgs.filter((org, index, self) => 
                index === self.findIndex(o => o.login === org.login)
              )
              orgs = uniqueOrgs
              console.log(`\n🔄 Total unique organizations: ${orgs.length}`)
            }
          } catch (error) {
            console.warn('Failed to fetch authenticated organizations:', error)
          }
        }
        
        if (orgs.length === 0) {
          console.log(`\n⚠️ No organizations found. This could mean:`)
          console.log(`  • You're not a member of any organizations`)
          console.log(`  • Your organizations are private and not accessible`)
          console.log(`  • You need to check your GitHub access token permissions`)
        }
        
        let totalCommits = 0
        let totalRepos = personalRepos.length
        
        // Count commits from personal repos
        console.log(`\n--- Processing personal repos: ${personalRepos.length} repos found ---`)
        for (const repo of personalRepos) {
          if (repo.fork) {
            console.log(`⏭️ Skipping forked repo: ${repo.name}`)
            continue
          }
          
          try {
            // First check if repo has commits by looking at the default branch
            const commitsResponse = await fetch(`https://api.github.com/repos/kevinksaji/${repo.name}/commits?per_page=1`, { headers })
            if (commitsResponse.ok) {
              // Check the Link header for total commit count
              const linkHeader = commitsResponse.headers.get('link')
              if (linkHeader) {
                const match = linkHeader.match(/page=(\d+)>; rel="last"/)
                if (match) {
                  totalCommits += parseInt(match[1])
                  console.log(`Repo ${repo.name}: ${match[1]} commits`)
                }
              } else {
                // If no Link header, try to get a reasonable estimate
                const allCommitsResponse = await fetch(`https://api.github.com/repos/kevinksaji/${repo.name}/commits?per_page=100`, { headers })
                if (allCommitsResponse.ok) {
                  const allCommits = await allCommitsResponse.json()
                  totalCommits += allCommits.length
                  console.log(`Repo ${repo.name}: ${allCommits.length} commits (estimated)`)
                }
              }
            } else if (commitsResponse.status === 409) {
              // Repository is empty (no commits yet)
              console.log(`Repository ${repo.name} is empty, skipping commit count`)
              continue
            }
          } catch (error) {
            console.warn(`Failed to fetch commits for repo ${repo.name}:`, error)
          }
        }
        
        // Count commits from organization repos
        console.log(`\n--- Processing organization: ${orgs.length} orgs found ---`)
        for (const org of orgs) {
          console.log(`\n🔍 Checking organization: ${org.login}`)
          try {
            const orgReposResponse = await fetch(`https://api.github.com/orgs/${org.login}/repos?per_page=100`, { headers })
            if (!orgReposResponse.ok) {
              console.log(`❌ Failed to fetch repos for org ${org.login}: ${orgReposResponse.status}`)
              continue
            }
            const orgRepos = await orgReposResponse.json()
            console.log(`📁 Found ${orgRepos.length} repos in ${org.login}`)
            
            // Filter repos where user has access
            const accessibleRepos = orgRepos.filter((repo: any) => 
              repo.permissions && (repo.permissions.push || repo.permissions.admin || repo.permissions.maintain)
            )
            console.log(`🔑 User has access to ${accessibleRepos.length} repos in ${org.login}`)
            
            totalRepos += accessibleRepos.length
            
            for (const repo of accessibleRepos) {
              try {
                const commitsResponse = await fetch(`https://api.github.com/repos/${org.login}/${repo.name}/commits?per_page=1`, { headers })
                if (commitsResponse.ok) {
                  // Check the Link header for total commit count
                  const linkHeader = commitsResponse.headers.get('link')
                  if (linkHeader) {
                    const match = linkHeader.match(/page=(\d+)>; rel="last"/)
                    if (match) {
                      totalCommits += parseInt(match[1])
                      console.log(`Org repo ${org.login}/${repo.name}: ${match[1]} commits`)
                    }
                  } else {
                    // If no Link header, try to get a reasonable estimate
                    const allCommitsResponse = await fetch(`https://api.github.com/repos/${org.login}/${repo.name}/commits?per_page=100`, { headers })
                    if (allCommitsResponse.ok) {
                      const allCommits = await allCommitsResponse.json()
                      totalCommits += allCommits.length
                      console.log(`Org repo ${org.login}/${repo.name}: ${allCommits.length} commits (estimated)`)
                    }
                  }
                } else if (commitsResponse.status === 409) {
                  // Repository is empty (no commits yet)
                  console.log(`Organization repository ${org.login}/${repo.name} is empty, skipping commit count`)
                  continue
                }
              } catch (error) {
                console.warn(`Failed to fetch commits for org repo ${org.login}/${repo.name}:`, error)
              }
            }
          } catch (error) {
            console.warn(`Failed to fetch repos for org ${org.login}:`, error)
          }
        }
        
        console.log(`\n📊 FINAL SUMMARY:`)
        console.log(`✅ Total commits: ${totalCommits.toLocaleString()}`)
        console.log(`✅ Total repos: ${totalRepos}`)
        console.log(`✅ Personal repos processed: ${personalRepos.filter((r: any) => !r.fork).length}`)
        console.log(`✅ Organizations processed: ${orgs.length}`)
        
        const newStats = {
          totalCommits,
          publicRepos: totalRepos,
          followers: userData.followers
        }
        
        setStats(newStats)
        
        // Fetch contributions using GraphQL
        if (token) {
          try {
            const contributionsResponse = await fetch('https://api.github.com/graphql', {
              method: 'POST',
              headers: {
                'Authorization': `bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                query: `
                  query {
                    user(login: "kevinksaji") {
                      contributionsCollection {
                        contributionCalendar {
                          totalContributions
                          weeks {
                            contributionDays {
                              contributionCount
                              date
                            }
                          }
                        }
                      }
                    }
                  }
                `
              })
            })
            
            if (contributionsResponse.ok) {
              const data = await contributionsResponse.json()
              console.log('GraphQL Response:', data)
              
              if (data.errors) {
                console.warn('GraphQL errors:', data.errors)
                return
              }
              
              if (data.data?.user?.contributionsCollection?.contributionCalendar?.weeks) {
                const allContributions: ContributionDay[] = []
                
                data.data.user.contributionsCollection.contributionCalendar.weeks.forEach((week: any) => {
                  week.contributionDays.forEach((day: any) => {
                    allContributions.push(day)
                  })
                })
                
                setContributions(allContributions)
              } else {
                console.warn('Unexpected GraphQL response structure:', data)
              }
            } else {
              console.warn('Contributions response not ok:', contributionsResponse.status, contributionsResponse.statusText)
            }
          } catch (error) {
            console.warn('Failed to fetch contributions:', error)
          }
        }
        
        setLoading(false)
        setError(null)
        
      } catch (error) {
        console.error('Error fetching GitHub stats:', error)
        
        if (error instanceof Error && error.message === 'Rate limit exceeded') {
          setRateLimitInfo('Rate limit exceeded')
        } else {
          setError('Failed to fetch GitHub stats')
        }
        
        setLoading(false)
      }
    }

    fetchGitHubStats()
  }, [])

  const getContributionColor = (count: number) => {
    if (count === 0) return 'bg-gray-200 dark:bg-gray-700'
    if (count <= 3) return 'bg-emerald-200 dark:bg-emerald-800'
    if (count <= 6) return 'bg-emerald-400 dark:bg-emerald-600'
    if (count <= 9) return 'bg-emerald-600 dark:bg-emerald-400'
    return 'bg-emerald-800 dark:bg-emerald-200'
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-card border border-border rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground mb-4">GitHub</h3>
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded"></div>
            <div className="h-8 bg-muted rounded"></div>
          </div>
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
        className="bg-card border border-border rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground mb-4">GitHub</h3>
          <div className="text-red-500 text-sm">{error}</div>
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
        <h3 className="text-lg font-semibold text-foreground mb-4">GitHub</h3>
        
        {rateLimitInfo && (
          <div className="text-xs text-muted-foreground mb-3 bg-muted px-2 py-1 rounded">
            {rateLimitInfo}
          </div>
        )}
        
        <div className="space-y-4">
          <div className="flex items-start justify-center gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">
                {stats.totalCommits.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                Commits
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">
                {stats.publicRepos}
              </div>
              <div className="text-sm text-muted-foreground">
                Repos
              </div>
            </div>
          </div>
          
          {/* Real GitHub Contribution Graph */}
          {contributions.length > 0 && (
            <div className="border-t border-border pt-4">
              <div className="text-center mb-3">
                <div className="text-sm text-muted-foreground mb-2">Contribution Graph</div>
                <div className="flex justify-center">
                  <div className="grid grid-cols-53 gap-0.5">
                    {contributions.map((day, i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-1.5 rounded-sm ${getContributionColor(day.contributionCount)}`}
                        title={`${day.date}: ${day.contributionCount} contributions`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center items-center gap-3 text-xs text-muted-foreground">
                <span>Less</span>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-sm bg-gray-200 dark:bg-gray-700"></div>
                  <div className="w-1.5 h-1.5 rounded-sm bg-emerald-200 dark:bg-emerald-800"></div>
                  <div className="w-1.5 h-1.5 rounded-sm bg-emerald-400 dark:bg-emerald-600"></div>
                  <div className="w-1.5 h-1.5 rounded-sm bg-emerald-600 dark:bg-emerald-400"></div>
                  <div className="w-1.5 h-1.5 rounded-sm bg-emerald-800 dark:bg-emerald-200"></div>
                </div>
                <span>More</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
