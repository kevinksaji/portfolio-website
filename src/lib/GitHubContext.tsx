'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface GitHubStats {
  totalCommits: number;
  publicRepos: number;
  followers: number;
}

interface ContributionDay {
  contributionCount: number;
  date: string;
}

interface GitHubContextType {
  stats: GitHubStats;
  contributions: ContributionDay[];
  loading: boolean;
  error: string | null;
  rateLimitInfo: string | null;
  refreshData: () => void;
}

const GitHubContext = createContext<GitHubContextType | undefined>(undefined);

// Cache duration - 2 hours
const CACHE_DURATION = 2 * 60 * 60 * 1000;

export function GitHubProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<GitHubStats>({
    totalCommits: 0,
    publicRepos: 0,
    followers: 0
  });
  const [contributions, setContributions] = useState<ContributionDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rateLimitInfo, setRateLimitInfo] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchGitHubStats = async (showLoading = true) => {
    try {
      // Check cache first and show immediately if available
      try {
        const cached = localStorage.getItem('github-stats-cache');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.data && parsed.timestamp && 
              parsed.data.stats && parsed.data.contributions &&
              Date.now() - parsed.timestamp < CACHE_DURATION) {
            console.log('📦 Using cached GitHub stats');
            setStats(parsed.data.stats);
            setContributions(parsed.data.contributions);
            setLoading(false);
            setError(null);
            
            // If cache is older than 1 hour, refresh in background
            if (Date.now() - parsed.timestamp > 60 * 60 * 1000) {
              console.log('🔄 Cache is older than 1 hour, refreshing in background...');
              // Don't set loading to true, just fetch in background
            } else {
              return; // Cache is fresh, no need to fetch
            }
          } else {
            // Invalid or expired cache, remove it
            console.log('🗑️ Clearing invalid/expired cache');
            localStorage.removeItem('github-stats-cache');
          }
        }
      } catch (error) {
        // If cache parsing fails, remove the corrupted cache
        console.warn('Failed to parse cached data, clearing cache:', error);
        localStorage.removeItem('github-stats-cache');
      }
      
      // Only show loading if we don't have cached data
      if (showLoading && contributions.length === 0) {
        setLoading(true);
      }
      
      // Get GitHub token from environment
      const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
      
      // Prepare headers for API requests
      const headers: HeadersInit = {
        'Accept': 'application/vnd.github.v3+json'
      };
      
      if (token) {
        headers['Authorization'] = `token ${token}`;
      }
      
      // Fetch user data
      const userResponse = await fetch('https://api.github.com/users/kevinksaji', { headers });
      if (!userResponse.ok) throw new Error('Failed to fetch user data');
      const userData = await userResponse.json();
      
      // Check rate limit headers
      const remaining = userResponse.headers.get('x-ratelimit-remaining');
      const reset = userResponse.headers.get('x-ratelimit-reset');
      
      console.log('GitHub API Rate Limit:', { remaining, reset });
      
      if (remaining === '0') {
        throw new Error('Rate limit exceeded');
      }
      
      // Only show rate limit warning if we're getting close (less than 10 requests remaining)
      if (remaining && parseInt(remaining) < 10) {
        setRateLimitInfo(`Rate limit low: ${remaining} requests remaining`);
      }
      
      // Fetch personal repositories
      const personalReposResponse = await fetch('https://api.github.com/users/kevinksaji/repos?per_page=100', { headers });
      if (!personalReposResponse.ok) throw new Error('Failed to fetch personal repos');
      const personalRepos = await personalReposResponse.json();
      
      // Fetch organization memberships (public endpoint - only shows public orgs)
      let orgs: any[] = [];
      
      // Try public endpoint first
      const publicOrgsResponse = await fetch('https://api.github.com/users/kevinksaji/orgs', { headers });
      if (publicOrgsResponse.ok) {
        const publicOrgs = await publicOrgsResponse.json();
        console.log(`\n🏢 Public organizations found: ${publicOrgs.length}`);
        if (publicOrgs.length > 0) {
          publicOrgs.forEach((org: any) => console.log(`  - ${org.login} (${org.type || 'unknown type'})`));
        }
        orgs = publicOrgs;
      }
      
      // If we have a token, also try the authenticated endpoint for private orgs
      if (token) {
        try {
          const authOrgsResponse = await fetch('https://api.github.com/user/orgs', { headers });
          if (authOrgsResponse.ok) {
            const authOrgs = await authOrgsResponse.json();
            console.log(`\n🔐 Authenticated organizations found: ${authOrgs.length}`);
            if (authOrgs.length > 0) {
              authOrgs.forEach((org: any) => console.log(`  - ${org.login} (${org.type || 'unknown type'})`));
            }
            
            // Merge and deduplicate orgs
            const allOrgs = [...orgs, ...authOrgs];
            const uniqueOrgs = allOrgs.filter((org, index, self) => 
              index === self.findIndex(o => o.login === org.login)
            );
            orgs = uniqueOrgs;
            console.log(`\n🔄 Total unique organizations: ${orgs.length}`);
          }
        } catch (error) {
          console.warn('Failed to fetch authenticated organizations:', error);
        }
      }
      
      if (orgs.length === 0) {
        console.log(`\n⚠️ No organizations found. This could mean:`);
        console.log(`  • You're not a member of any organizations`);
        console.log(`  • Your organizations are private and not accessible`);
        console.log(`  • You need to check your GitHub access token permissions`);
      }
      
      let totalCommits = 0;
      let totalRepos = personalRepos.length;
      
      // Count commits from personal repos (parallel approach)
      console.log(`\n--- Processing personal repos: ${personalRepos.length} repos found ---`);
      const nonForkedRepos = personalRepos.filter((repo: any) => !repo.fork);
      
      if (nonForkedRepos.length > 0) {
        const personalRepoPromises = nonForkedRepos.map(async (repo: any) => {
          try {
            const commitsResponse = await fetch(`https://api.github.com/repos/kevinksaji/${repo.name}/commits?per_page=1`, { headers });
            if (commitsResponse.ok) {
              const linkHeader = commitsResponse.headers.get('link');
              if (linkHeader) {
                const match = linkHeader.match(/page=(\d+)>; rel="last"/);
                if (match) {
                  console.log(`Repo ${repo.name}: ${match[1]} commits`);
                  return parseInt(match[1]);
                }
              } else {
                // Quick estimate for repos without pagination info
                const allCommitsResponse = await fetch(`https://api.github.com/repos/kevinksaji/${repo.name}/commits?per_page=100`, { headers });
                if (allCommitsResponse.ok) {
                  const allCommits = await allCommitsResponse.json();
                  console.log(`Repo ${repo.name}: ${allCommits.length} commits (estimated)`);
                  return allCommits.length;
                }
              }
            } else if (commitsResponse.status === 409) {
              console.log(`Repository ${repo.name} is empty, skipping commit count`);
              return 0;
            }
          } catch (error) {
            console.warn(`Failed to fetch commits for repo ${repo.name}:`, error);
          }
          return 0;
        });
        
        const personalRepoResults = await Promise.all(personalRepoPromises);
        totalCommits += personalRepoResults.reduce((sum, count) => sum + count, 0);
      }
      
      // Count commits from organization repos (parallel approach)
      console.log(`\n--- Processing organizations: ${orgs.length} orgs found ---`);
      if (orgs.length > 0) {
        const orgPromises = orgs.map(async (org) => {
          try {
            const orgReposResponse = await fetch(`https://api.github.com/orgs/${org.login}/repos?per_page=100`, { headers });
            if (!orgReposResponse.ok) {
              console.log(`❌ Failed to fetch repos for org ${org.login}: ${orgReposResponse.status}`);
              return { commits: 0, repos: 0 };
            }
            const orgRepos = await orgReposResponse.json();
            console.log(`📁 Found ${orgRepos.length} repos in ${org.login}`);
            
            // Filter repos where user has access
            const accessibleRepos = orgRepos.filter((repo: any) => 
              repo.permissions && (repo.permissions.push || repo.permissions.admin || repo.permissions.maintain)
            );
            console.log(`🔑 User has access to ${accessibleRepos.length} repos in ${org.login}`);
            
            if (accessibleRepos.length === 0) {
              return { commits: 0, repos: 0 };
            }
            
            // Fetch commit counts for all accessible repos in parallel
            const repoPromises = accessibleRepos.map(async (repo: any) => {
              try {
                const commitsResponse = await fetch(`https://api.github.com/repos/${org.login}/${repo.name}/commits?per_page=1`, { headers });
                if (commitsResponse.ok) {
                  const linkHeader = commitsResponse.headers.get('link');
                  if (linkHeader) {
                    const match = linkHeader.match(/page=(\d+)>; rel="last"/);
                    if (match) {
                      console.log(`Org repo ${org.login}/${repo.name}: ${match[1]} commits`);
                      return parseInt(match[1]);
                    }
                  } else {
                    // Quick estimate for repos without pagination info
                    const allCommitsResponse = await fetch(`https://api.github.com/repos/${org.login}/${repo.name}/commits?per_page=100`, { headers });
                    if (allCommitsResponse.ok) {
                      const allCommits = await allCommitsResponse.json();
                      console.log(`Org repo ${org.login}/${repo.name}: ${allCommits.length} commits (estimated)`);
                      return allCommits.length;
                    }
                  }
                } else if (commitsResponse.status === 409) {
                  console.log(`Organization repository ${org.login}/${repo.name} is empty, skipping commit count`);
                  return 0;
                }
              } catch (error) {
                console.warn(`Failed to fetch commits for org repo ${org.login}/${repo.name}:`, error);
              }
              return 0;
            });
            
            const repoResults = await Promise.all(repoPromises);
            const totalOrgCommits = repoResults.reduce((sum, count) => sum + count, 0);
            
            return { commits: totalOrgCommits, repos: accessibleRepos.length };
          } catch (error) {
            console.warn(`Failed to fetch repos for org ${org.login}:`, error);
            return { commits: 0, repos: 0 };
          }
        });
        
        const orgResults = await Promise.all(orgPromises);
        const totalOrgCommits = orgResults.reduce((sum, result) => sum + result.commits, 0);
        const totalOrgRepos = orgResults.reduce((sum, result) => sum + result.repos, 0);
        
        totalCommits += totalOrgCommits;
        totalRepos += totalOrgRepos;
      }
      
      console.log(`\n📊 FINAL SUMMARY:`);
      console.log(`✅ Total commits: ${totalCommits.toLocaleString()}`);
      console.log(`✅ Total repos: ${totalRepos}`);
      console.log(`✅ Personal repos processed: ${personalRepos.filter((r: any) => !r.fork).length}`);
      console.log(`✅ Organizations processed: ${orgs.length}`);
      
      const newStats = {
        totalCommits,
        publicRepos: totalRepos,
        followers: userData.followers
      };
      
      setStats(newStats);
      
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
          });
          
          if (contributionsResponse.ok) {
            const data = await contributionsResponse.json();
            console.log('GraphQL Response:', data);
            
            if (data.errors) {
              console.warn('GraphQL errors:', data.errors);
              return;
            }
            
            if (data.data?.user?.contributionsCollection?.contributionCalendar?.weeks) {
              const allContributions: ContributionDay[] = [];
              
              data.data.user.contributionsCollection.contributionCalendar.weeks.forEach((week: any) => {
                week.contributionDays.forEach((day: ContributionDay) => {
                  allContributions.push(day);
                });
              });
              
              setContributions(allContributions);
              
              // Cache the complete results (stats + contributions)
              const cacheData = {
                data: {
                  stats: newStats,
                  contributions: allContributions
                },
                timestamp: Date.now()
              };
              localStorage.setItem('github-stats-cache', JSON.stringify(cacheData));
              console.log('💾 Cached GitHub stats for 24 hours');
            } else {
              console.warn('Unexpected GraphQL response structure:', data);
            }
          } else {
            console.warn('Contributions response not ok:', contributionsResponse.status, contributionsResponse.statusText);
          }
        } catch (error) {
          console.warn('Failed to fetch contributions:', error);
        }
      }
      
      setLoading(false);
      setError(null);
      
    } catch (error) {
      console.error('Error fetching GitHub stats:', error);
      
      if (error instanceof Error && error.message === 'Rate limit exceeded') {
        setRateLimitInfo('Rate limit exceeded');
      } else {
        setError('Failed to fetch GitHub stats');
      }
      
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isInitialized) {
      fetchGitHubStats(true);
      setIsInitialized(true);
    }
  }, [isInitialized]);

  const refreshData = () => {
    fetchGitHubStats(true);
  };

  return (
    <GitHubContext.Provider value={{
      stats,
      contributions,
      loading,
      error,
      rateLimitInfo,
      refreshData
    }}>
      {children}
    </GitHubContext.Provider>
  );
}

export function useGitHub() {
  const context = useContext(GitHubContext);
  if (context === undefined) {
    throw new Error('useGitHub must be used within a GitHubProvider');
  }
  return context;
}
