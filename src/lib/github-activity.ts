const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";
const DEFAULT_GITHUB_USERNAME = "tjsook";

type GitHubContributionDay = {
  contributionCount: number;
  date: string;
  weekday: number;
};

export type GitHubContributionWeek = {
  contributionDays: GitHubContributionDay[];
};

export type GitHubContributionCalendar = {
  totalContributions: number;
  weeks: GitHubContributionWeek[];
};

type GitHubContributionResponse = {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: GitHubContributionCalendar;
      };
    };
  };
  errors?: { message: string }[];
};

const CONTRIBUTIONS_QUERY = `
  query UserContributions($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
              weekday
            }
          }
        }
      }
    }
  }
`;

export function getGitHubUsername() {
  return process.env.GITHUB_USERNAME ?? DEFAULT_GITHUB_USERNAME;
}

export function hasGitHubActivityConfig() {
  return Boolean(process.env.GITHUB_TOKEN);
}

export async function getGitHubContributionCalendar(
  year = new Date().getFullYear(),
): Promise<GitHubContributionCalendar> {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    throw new Error("GITHUB_TOKEN is not set.");
  }

  const username = getGitHubUsername();
  const from = new Date(Date.UTC(year, 0, 1)).toISOString();
  const to = new Date(Date.UTC(year, 11, 31, 23, 59, 59)).toISOString();

  const response = await fetch(GITHUB_GRAPHQL_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: CONTRIBUTIONS_QUERY,
      variables: {
        login: username,
        from,
        to,
      },
    }),
    next: {
      revalidate: 21600,
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API request failed with status ${response.status}.`);
  }

  const payload = (await response.json()) as GitHubContributionResponse;

  if (payload.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message).join(" "));
  }

  const calendar =
    payload.data?.user?.contributionsCollection?.contributionCalendar;

  if (!calendar) {
    throw new Error(`GitHub contribution calendar was not returned for ${username}.`);
  }

  return calendar;
}
