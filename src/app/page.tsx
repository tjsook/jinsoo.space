import Link from "next/link";
import { getPublishedExperiences } from "@/lib/experiences";
import type { ExperienceRecord } from "@/types/experience";
import AdminStar from "./admin-star";
import CopyEmailIcon from "./copy-email-icon";
import ExperienceStack from "./experience-stack";
import GitHubActivity from "./github-activity";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

const MONTHS = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

function parseStartMonth(dateRange: string): number {
  const first = dateRange.split(/[–—-]/)[0]?.trim().toLowerCase() ?? "";
  const match = first.match(/([a-z]{3,})\s+(\d{4})/);
  if (!match) return 0;
  const monthIndex = MONTHS.findIndex((month) => match[1].startsWith(month));
  const year = parseInt(match[2], 10);
  return year * 12 + Math.max(monthIndex, 0);
}

type ExperienceGroup = {
  company: string;
  displayOrder: number;
  items: ExperienceRecord[];
};

function groupExperiencesByCompany(
  experiences: ExperienceRecord[],
): ExperienceGroup[] {
  const groups: ExperienceGroup[] = [];
  const byCompany = new Map<string, ExperienceGroup>();

  for (const exp of experiences) {
    let group = byCompany.get(exp.company);
    if (!group) {
      group = { company: exp.company, displayOrder: exp.display_order, items: [] };
      byCompany.set(exp.company, group);
      groups.push(group);
    }
    group.items.push(exp);
  }

  for (const group of groups) {
    group.items.sort(
      (a, b) => parseStartMonth(b.date_range) - parseStartMonth(a.date_range),
    );
  }

  groups.sort((a, b) => a.displayOrder - b.displayOrder);

  return groups;
}

function SingleExperienceCard({ exp }: { exp: ExperienceRecord }) {
  const body = (
    <>
      <div className={styles.experienceCompany}>{exp.company}</div>
      <div className={styles.experienceDate}>{exp.date_range}</div>
      <div className={styles.experienceRole}>{exp.role}</div>
      <div className={styles.experienceDescription}>{exp.description}</div>
    </>
  );

  if (!exp.link) {
    return <div className={styles.experienceCard}>{body}</div>;
  }

  return (
    <a
      href={exp.link}
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles.experienceCard} ${styles.experienceCardLinked}`}
    >
      {body}
    </a>
  );
}

export default async function Home() {
  const experiences = await getPublishedExperiences();
  const experienceGroups = groupExperiencesByCompany(experiences);
  return (
    <main className={styles.page}>
      <div className={styles.gridOverlay} aria-hidden="true" />

      {/* Top bar */}
      <header className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <AdminStar />
          <span className={styles.siteName}>jinsoo.space</span>
        </div>
        <div className={styles.socialIcons}>
          <a
            href="https://github.com/tjsook"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label="GitHub"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
          <a
            href="https://x.com/tjkxyz"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label="X"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/in/tyjkim"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label="LinkedIn"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
          <CopyEmailIcon />
        </div>
      </header>

      {/* Navigation */}
      <nav className={styles.navRow}>
        <Link href="/me" className={styles.navLink}>
          who i am
        </Link>
        <Link href="/writings" className={styles.navLink}>
          writings
        </Link>
        <Link href="/projects" className={styles.navLink}>
          projects
        </Link>
      </nav>

      {/* Hero */}
      <section className={styles.hero}>
        <h1 className={styles.heroName}>
          tyler <span className={styles.heroAccent}>jinsoo</span> kim
        </h1>
        <p className={styles.heroBio}>
          sophomore (junior standing) · CS @ Cal Poly
          <br />
          building Hangars, prev. SWE Intern @ Hemut, TL @ H4I
          <br />
          <span className={styles.heroBioAccent}>
            building things that serve purpose
          </span>
        </p>
      </section>

      {/* Experience */}
      {experiences.length > 0 ? (
        <section className={styles.experienceSection}>
          <div className={styles.experienceHeader}>
            <span className={styles.sectionTitle}>experience</span>
            <span className={styles.scrollHint}>scroll →</span>
          </div>
          <div className={styles.experienceScroller}>
            <div className={styles.experienceCards}>
              {experienceGroups.map((group) =>
                group.items.length === 1 ? (
                  <SingleExperienceCard
                    key={group.items[0].id}
                    exp={group.items[0]}
                  />
                ) : (
                  <ExperienceStack key={group.company} items={group.items} />
                ),
              )}
            </div>
          </div>
        </section>
      ) : null}

      {/* Activity */}
      <section className={styles.activitySection}>
        <GitHubActivity />
      </section>
    </main>
  );
}
