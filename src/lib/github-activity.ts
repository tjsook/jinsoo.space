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

/* ---------------------------------------------------------------- recency */

export type GitHubLatestPush = {
  /** Repository name without its owner. */
  name: string;
  owner: string;
  ownerIsOrg: boolean;
  isPrivate: boolean;
  pushedAt: string;
};

type GitHubLatestPushResponse = {
  data?: {
    user?: {
      repositories?: {
        nodes?: {
          name: string;
          isPrivate: boolean;
          pushedAt: string | null;
          owner: { login: string; __typename: string };
        }[];
      };
    };
  };
  errors?: { message: string }[];
};

const LATEST_PUSH_QUERY = `
  query LatestPush($login: String!) {
    user(login: $login) {
      repositories(
        first: 1
        orderBy: { field: PUSHED_AT, direction: DESC }
        affiliations: [OWNER, COLLABORATOR, ORGANIZATION_MEMBER]
      ) {
        nodes {
          name
          isPrivate
          pushedAt
          owner {
            login
            __typename
          }
        }
      }
    }
  }
`;

/**
 * The most recently pushed repository the token can see, private ones
 * included. Cached far more briefly than the calendar, because "4h ago" is
 * the whole point of it.
 */
export async function getGitHubLatestPush(): Promise<GitHubLatestPush | null> {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return null;
  }

  const response = await fetch(GITHUB_GRAPHQL_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: LATEST_PUSH_QUERY,
      variables: { login: getGitHubUsername() },
    }),
    next: {
      revalidate: 900,
    },
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as GitHubLatestPushResponse;
  const node = payload.data?.user?.repositories?.nodes?.[0];

  if (!node?.pushedAt) {
    return null;
  }

  return {
    name: node.name,
    owner: node.owner.login,
    ownerIsOrg: node.owner.__typename === "Organization",
    isPrivate: node.isPrivate,
    pushedAt: node.pushedAt,
  };
}

/* ------------------------------------------------------------ calendar math */

const WEEKDAY_NAMES = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export type ContributionSummary = {
  currentStreak: number;
  activeDays: number;
  elapsedDays: number;
  busiestWeekday: string;
  busiestWeekdayTotal: number;
};

export function summarizeContributions(
  weeks: GitHubContributionWeek[],
  today = new Date(),
): ContributionSummary {
  const todayKey = today.toISOString().slice(0, 10);
  // The calendar runs to December, so the rest of the year is padding.
  const days = weeks
    .flatMap((week) => week.contributionDays)
    .filter((day) => day.date <= todayKey)
    .sort((a, b) => a.date.localeCompare(b.date));

  const weekdayTotals: number[] = new Array(7).fill(0);
  let activeDays = 0;

  for (const day of days) {
    weekdayTotals[day.weekday] += day.contributionCount;
    if (day.contributionCount > 0) activeDays += 1;
  }

  let currentStreak = 0;
  for (let index = days.length - 1; index >= 0; index -= 1) {
    if (days[index].contributionCount > 0) {
      currentStreak += 1;
      continue;
    }
    // A day that is still in progress does not break the streak.
    if (days[index].date === todayKey) continue;
    break;
  }

  const busiestIndex = weekdayTotals.reduce(
    (best, total, index) => (total > weekdayTotals[best] ? index : best),
    0,
  );

  return {
    currentStreak,
    activeDays,
    elapsedDays: days.length,
    busiestWeekday: WEEKDAY_NAMES[busiestIndex],
    busiestWeekdayTotal: weekdayTotals[busiestIndex],
  };
}

/** "4h ago", the way a person would say it. */
export function formatRelativeTime(iso: string, now = new Date()) {
  const minutes = Math.max(
    0,
    Math.round((now.getTime() - new Date(iso).getTime()) / 60000),
  );

  if (minutes < 5) return "just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;

  const months = Math.round(days / 30);
  return `${months}mo ago`;
}

const ORG_SUFFIX = /[-_](dev|devs|inc|labs|io|hq|team|org|tech)$/i;

/**
 * What the page is allowed to say about a push. A public repository can be
 * named; a private one only ever shows the organization behind it, and a
 * private personal repo shows nothing at all.
 */
export function describePushTarget(push: GitHubLatestPush) {
  if (!push.isPrivate) return push.name;
  if (push.ownerIsOrg) return push.owner.replace(ORG_SUFFIX, "").toLowerCase();

  return "private";
}
