import {
  describePushTarget,
  formatRelativeTime,
  getGitHubContributionCalendar,
  getGitHubLatestPush,
  getGitHubUsername,
  hasGitHubActivityConfig,
  summarizeContributions,
  type GitHubContributionCalendar,
  type GitHubContributionWeek,
  type GitHubLatestPush,
} from "@/lib/github-activity";
import styles from "./page.module.css";

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function getContributionLevel(count: number) {
  if (count === 0) return 0;
  if (count < 3) return 1;
  if (count < 7) return 2;
  if (count < 12) return 3;
  return 4;
}

function getContributionText(count: number, date: string) {
  const noun = count === 1 ? "contribution" : "contributions";
  return `${count} ${noun} on ${date}`;
}

function getMonthMarkers(weeks: GitHubContributionWeek[]) {
  const markers: { label: string; column: number }[] = [];
  let lastMonth = -1;

  weeks.forEach((week, weekIndex) => {
    const firstDay = week.contributionDays.find((day) => {
      const date = new Date(`${day.date}T00:00:00Z`);
      return date.getUTCDate() <= 7;
    });

    if (!firstDay) return;

    const month = new Date(`${firstDay.date}T00:00:00Z`).getUTCMonth();

    if (month !== lastMonth) {
      markers.push({ label: MONTH_LABELS[month], column: weekIndex + 1 });
      lastMonth = month;
    }
  });

  return markers;
}

function ContributionGrid({ weeks }: { weeks: GitHubContributionWeek[] }) {
  const monthMarkers = getMonthMarkers(weeks);

  return (
    <div className={styles.activityScroller}>
      <div
        className={styles.activityMonths}
        style={{ gridTemplateColumns: `repeat(${weeks.length}, 11px)` }}
        aria-hidden="true"
      >
        {monthMarkers.map((marker) => (
          <span
            key={`${marker.label}-${marker.column}`}
            style={{ gridColumn: marker.column }}
          >
            {marker.label}
          </span>
        ))}
      </div>

      <div className={styles.activityGraphRow}>
        <div className={styles.activityWeekdays} aria-hidden="true">
          <span>Mon</span>
          <span>Wed</span>
          <span>Fri</span>
        </div>

        <div
          className={styles.activityGrid}
          style={{ gridTemplateColumns: `repeat(${weeks.length}, 11px)` }}
        >
          {weeks.map((week, weekIndex) =>
            week.contributionDays.map((day) => {
              const level = getContributionLevel(day.contributionCount);

              return (
                <span
                  key={day.date}
                  className={`${styles.activityDay} ${styles[`activityLevel${level}`]}`}
                  data-tooltip={getContributionText(
                    day.contributionCount,
                    day.date,
                  )}
                  aria-label={getContributionText(
                    day.contributionCount,
                    day.date,
                  )}
                  style={{
                    gridColumn: weekIndex + 1,
                    gridRow: day.weekday + 1,
                  }}
                />
              );
            }),
          )}
        </div>
      </div>

      <div className={styles.activityLegend} aria-label="Contribution intensity">
        <span aria-hidden="true">−</span>
        <span
          className={`${styles.activityLegendCube} ${styles.activityLevel0}`}
        />
        <span
          className={`${styles.activityLegendCube} ${styles.activityLevel1}`}
        />
        <span
          className={`${styles.activityLegendCube} ${styles.activityLevel2}`}
        />
        <span
          className={`${styles.activityLegendCube} ${styles.activityLevel3}`}
        />
        <span
          className={`${styles.activityLegendCube} ${styles.activityLevel4}`}
        />
        <span aria-hidden="true">+</span>
      </div>
    </div>
  );
}

export default async function GitHubActivity() {
  const year = new Date().getFullYear();
  const username = getGitHubUsername();

  if (!hasGitHubActivityConfig()) {
    return (
      <div aria-label="github activity">
        <p className={styles.activityError}>
          GITHUB_TOKEN is not set. Add it in Vercel to render the contribution
          calendar for @{username}.
        </p>
      </div>
    );
  }

  let calendar: GitHubContributionCalendar | null = null;
  let latestPush: GitHubLatestPush | null = null;
  let errorMessage = "";

  try {
    [calendar, latestPush] = await Promise.all([
      getGitHubContributionCalendar(year),
      // Recency is a nice-to-have; the graph must not fail because of it.
      getGitHubLatestPush().catch(() => null),
    ]);
  } catch (error) {
    errorMessage =
      error instanceof Error
        ? error.message
        : "GitHub activity failed to load.";
  }

  if (!calendar) {
    return (
      <div aria-label="github activity">
        <p className={styles.activityError}>{errorMessage}</p>
      </div>
    );
  }

  return (
    <div aria-label="github activity">
      <div className={styles.activityHeader}>
        <span className={styles.label}>(3) activity</span>
        <div className={styles.activityTotal}>
          <span className={styles.activityNumber}>
            {calendar.totalContributions.toLocaleString()}
          </span>
          <span className={styles.activityUnit}>
            contributions in {year} · @{username}
          </span>
        </div>
      </div>
      <div className={styles.activityBody}>
        <ContributionGrid weeks={calendar.weeks} />
        <ActivityStats weeks={calendar.weeks} latestPush={latestPush} />
      </div>
    </div>
  );
}

function ActivityStats({
  weeks,
  latestPush,
}: {
  weeks: GitHubContributionWeek[];
  latestPush: GitHubLatestPush | null;
}) {
  const summary = summarizeContributions(weeks);

  const stats = [
    latestPush
      ? {
          label: "last push",
          value: describePushTarget(latestPush),
          detail: formatRelativeTime(latestPush.pushedAt),
        }
      : null,
    {
      label: "busiest weekday",
      value: `${summary.busiestWeekday}s`,
      detail: `${summary.busiestWeekdayTotal.toLocaleString()} contributions`,
    },
    {
      label: "current streak",
      value: `${summary.currentStreak} ${summary.currentStreak === 1 ? "day" : "days"}`,
      detail: null,
    },
    {
      label: "active days",
      value: `${summary.activeDays} / ${summary.elapsedDays}`,
      detail: `${Math.round((summary.activeDays / Math.max(summary.elapsedDays, 1)) * 100)}% of the year so far`,
    },
  ].filter((stat) => stat !== null);

  return (
    <dl className={styles.activityStats}>
      {stats.map((stat) => (
        <div key={stat.label} className={styles.activityStat}>
          <dt className={styles.activityStatLabel}>{stat.label}</dt>
          <dd className={styles.activityStatValue}>
            {stat.value}
            {stat.detail ? (
              <span className={styles.activityStatDetail}>{stat.detail}</span>
            ) : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}
