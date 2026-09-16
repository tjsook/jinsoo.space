import {
  getGitHubContributionCalendar,
  getGitHubUsername,
  hasGitHubActivityConfig,
  type GitHubContributionCalendar,
  type GitHubContributionWeek,
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
  let errorMessage = "";

  try {
    calendar = await getGitHubContributionCalendar(year);
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
        <span className={styles.label}>(03) activity</span>
        <div className={styles.activityTotal}>
          <span className={styles.activityNumber}>
            {calendar.totalContributions.toLocaleString()}
          </span>
          <span className={styles.activityUnit}>
            contributions in {year} · @{username}
          </span>
        </div>
      </div>
      <ContributionGrid weeks={calendar.weeks} />
    </div>
  );
}
