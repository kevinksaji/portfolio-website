'use client';

import React, { createContext, useContext, useEffect, useState, type ReactNode, useCallback } from 'react';

type GitHubStats = {
  totalCommits: number | null;
  publicRepos: number;
};

type GitHubStatsApiResponse = {
  publicRepos: number;
  totalCommits: number | null;
  warning?: string;
};

type GitHubContextType = {
  stats: GitHubStats;
  loading: boolean;
  error: string | null;
  rateLimitInfo: string | null;
  refreshData: () => void;
};

const GitHubContext = createContext<GitHubContextType | undefined>(undefined);

export function GitHubProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<GitHubStats>({ totalCommits: null, publicRepos: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rateLimitInfo, setRateLimitInfo] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchGitHubStats = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);

      const res = await fetch('/api/github/stats', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch GitHub stats');

      const data: GitHubStatsApiResponse = await res.json();

      setStats({
        totalCommits: typeof data.totalCommits === 'number' ? data.totalCommits : null,
        publicRepos: typeof data.publicRepos === 'number' ? data.publicRepos : 0,
      });

      setRateLimitInfo(data.warning ?? null);
      setError(null);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching GitHub stats:', err);
      setError('Failed to fetch GitHub stats');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isInitialized) {
      fetchGitHubStats(true);
      setIsInitialized(true);
    }
  }, [isInitialized, fetchGitHubStats]);

  const refreshData = () => {
    fetchGitHubStats(true);
  };

  return (
    <GitHubContext.Provider
      value={{
        stats,
        loading,
        error,
        rateLimitInfo,
        refreshData,
      }}
    >
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
