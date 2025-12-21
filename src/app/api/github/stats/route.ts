import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GITHUB_LOGIN = 'kevinksaji';

type GitHubStatsResponse = {
    publicRepos: number;
    totalCommits: number | null;
    warning?: string;
};

type GitHubUserResponse = {
    public_repos?: number;
};

type GraphQLRepositoriesResponse = {
    data?: {
        user?: {
            repositories?: {
                pageInfo: {
                    hasNextPage: boolean;
                    endCursor: string | null;
                };
                nodes: Array<{
                    defaultBranchRef: null | {
                        target:
                        | null
                        | {
                            history?: {
                                totalCount: number;
                            };
                        };
                    };
                }>;
            };
        };
    };
    errors?: Array<{ message: string }>;
};

async function fetchPublicRepoCount(token?: string): Promise<number> {
    const headers: HeadersInit = {
        Accept: 'application/vnd.github.v3+json',
    };

    if (token) {
        headers.Authorization = `token ${token}`;
    }

    const res = await fetch(`https://api.github.com/users/${GITHUB_LOGIN}`, {
        headers,
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch GitHub user (${res.status})`);
    }

    const data: GitHubUserResponse = await res.json();
    return typeof data.public_repos === 'number' ? data.public_repos : 0;
}

async function fetchCommitTotalViaGraphQL(token: string): Promise<number> {
    const query = `
    query($login: String!, $after: String) {
      user(login: $login) {
        repositories(
          first: 100,
          after: $after,
          ownerAffiliations: [OWNER],
          affiliations: [OWNER],
          isFork: false
        ) {
          pageInfo { hasNextPage endCursor }
          nodes {
            defaultBranchRef {
              target {
                ... on Commit {
                  history { totalCount }
                }
              }
            }
          }
        }
      }
    }
  `;

    let after: string | null = null;
    let hasNextPage = true;
    let commitSum = 0;
    let pages = 0;

    while (hasNextPage && pages < 10) {
        pages += 1;

        const res = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
                Authorization: `bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables: { login: GITHUB_LOGIN, after },
            }),
            cache: 'no-store',
        });

        if (!res.ok) {
            throw new Error(`GitHub GraphQL request failed (${res.status})`);
        }

        const payload: GraphQLRepositoriesResponse = await res.json();

        if (payload.errors?.length) {
            throw new Error(payload.errors.map((e) => e.message).join('; '));
        }

        const repos = payload.data?.user?.repositories;
        if (!repos) {
            break;
        }

        for (const node of repos.nodes) {
            const historyTotal = node.defaultBranchRef?.target?.history?.totalCount;
            if (typeof historyTotal === 'number') commitSum += historyTotal;
        }

        hasNextPage = repos.pageInfo.hasNextPage;
        after = repos.pageInfo.endCursor;
    }

    return commitSum;
}

export async function GET() {
    try {
        const token = process.env.GITHUB_TOKEN;

        const publicRepos = await fetchPublicRepoCount(token);

        if (!token) {
            const body: GitHubStatsResponse = {
                publicRepos,
                totalCommits: null,
                warning: 'Missing GITHUB_TOKEN (commits unavailable)',
            };
            return NextResponse.json(body, { status: 200 });
        }

        const totalCommits = await fetchCommitTotalViaGraphQL(token);

        const body: GitHubStatsResponse = {
            publicRepos,
            totalCommits,
        };

        return NextResponse.json(body, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
