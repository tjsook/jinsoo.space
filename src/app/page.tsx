import { getAboutContent } from "@/lib/about-content";
import { getPublishedExperiences } from "@/lib/experiences";
import type { ExperienceRecord } from "@/types/experience";
import GitHubActivity from "./github-activity";
import Reveal from "./reveal";
import ScrollRail from "./scroll-rail";
import SiteHeader from "./site-header";
import SocialRow from "./social-row";
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

function splitRange(dateRange: string) {
  const [start, end] = dateRange.split(/\s*[–—-]\s*/);
  return { start: (start ?? "").trim(), end: (end ?? "").trim() };
}

function parseStartMonth(dateRange: string): number {
  const { start } = splitRange(dateRange.toLowerCase());
  const match = start.match(/([a-z]{3,})\s+(\d{4})/);
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
      group = {
        company: exp.company,
        displayOrder: exp.display_order,
        items: [],
      };
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

/** "2025 — now", "2026": the year column at the end of each row. */
function companyYears(items: ExperienceRecord[]) {
  const years = items
    .flatMap((item) => item.date_range.match(/\d{4}/g) ?? [])
    .map((year) => parseInt(year, 10));
  const ongoing = items.some((item) =>
    /current|present|ongoing/i.test(item.date_range),
  );

  if (years.length === 0) return ongoing ? "now" : "";

  const first = Math.min(...years);
  const last = ongoing ? "now" : String(Math.max(...years));

  return last === String(first) ? last : `${first} — ${last}`;
}

/** "https://www.hangars.dev/x" -> "hangars.dev", the visible link label. */
function linkLabel(link: string) {
  try {
    return new URL(link).hostname.replace(/^www\./, "");
  } catch {
    return "visit";
  }
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

/** "jun 2024" and "current" -> the two-digit years the section header shows. */
function coveredYears(experiences: ExperienceRecord[]) {
  const years = experiences
    .flatMap((exp) => exp.date_range.match(/\d{4}/g) ?? [])
    .map((year) => parseInt(year, 10));

  if (years.length === 0) return "";

  const first = String(Math.min(...years)).slice(2);
  const ongoing = experiences.some((exp) =>
    /current|present|ongoing/i.test(exp.date_range),
  );
  const last = ongoing
    ? String(new Date().getFullYear()).slice(2)
    : String(Math.max(...years)).slice(2);

  return first === last ? `${first}'` : `${first}—${last}'`;
}

function ExperienceRow({
  group,
  index,
}: {
  group: ExperienceGroup;
  index: number;
}) {
  const link = group.items.find((item) => item.link)?.link ?? null;

  const body = (
    <>
      <span className={styles.expIndex}>{pad(index + 1)}</span>

      <div className={styles.expHead}>
        <h3 className={styles.expCompany}>{group.company}</h3>
        {link ? (
          <span className={styles.expLink}>
            {linkLabel(link)}
            <span aria-hidden="true"> ↗</span>
          </span>
        ) : null}
      </div>

      <div className={styles.expRoles}>
        {group.items.map((item) => (
          <div key={item.id} className={styles.expRole}>
            <span className={styles.expRoleTitle}>{item.role}</span>
            <span className={styles.expRoleDate}>{item.date_range}</span>
            {item.description ? (
              <p className={styles.expDescription}>{item.description}</p>
            ) : null}
          </div>
        ))}
      </div>

      <span className={styles.expYears}>{companyYears(group.items)}</span>
    </>
  );

  return (
    <li className={styles.expRow}>
      <Reveal delay={Math.min(index, 4) * 60}>
        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.expInner} ${styles.expInnerLinked}`}
          >
            {body}
          </a>
        ) : (
          <div className={styles.expInner}>{body}</div>
        )}
      </Reveal>
    </li>
  );
}

export default async function Home() {
  const [experiences, about] = await Promise.all([
    getPublishedExperiences(),
    getAboutContent(),
  ]);
  const experienceGroups = groupExperiencesByCompany(experiences);
  const years = coveredYears(experiences);
  const aboutParagraphs = about.content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <main className={styles.page}>
      <ScrollRail />
      <SiteHeader />

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroTop}>
          <h1 className={styles.heroName}>
            <span className={styles.heroLine}>tyler</span>
            <span className={`${styles.heroLine} ${styles.heroAccent}`}>
              jinsoo
            </span>
            <span className={styles.heroLine}>
              kim
              <span className={styles.heroCaret} aria-hidden="true" />
            </span>
          </h1>

          <div className={styles.heroAside}>
            <p className={styles.heroBio}>
              sophomore (junior standing) · CS @ Cal Poly SLO
            </p>
            <p className={styles.heroBio}>
              building Hangars, prev. SWE Intern @ Hemut, TL @ H4I
            </p>
          </div>
        </div>

        <div className={styles.heroFoot}>
          <SocialRow />
          <span className={styles.scrollCue}>(scroll)</span>
        </div>
      </section>

      {/* Experience */}
      {experienceGroups.length > 0 ? (
        <section id="experience" className={styles.section}>
          <Reveal>
            <div className={styles.expHeader}>
              <span className={styles.label}>(1) experience</span>
              <h2 className={styles.expTitle}>
                <span className={styles.expTitleLead}>where</span>
                <span className={styles.expTitleTail}>i&apos;ve built</span>
              </h2>
              <div className={styles.expHeaderFoot}>
                <span className={styles.expTitleYears}>{years}</span>
                <span className={styles.expCount}>
                  (01–{pad(experienceGroups.length)})
                </span>
              </div>
            </div>
          </Reveal>

          <ol className={styles.expList}>
            {experienceGroups.map((group, index) => (
              <ExperienceRow key={group.company} group={group} index={index} />
            ))}
          </ol>
        </section>
      ) : null}

      {/* Who i am */}
      <section id="who" className={styles.who}>
        <Reveal>
          <span className={styles.label}>(2) who i am</span>
          <div className={styles.whoGrid}>
            <div className={styles.whoBio}>
              {aboutParagraphs.map((paragraph, index) => (
                <p key={`about-${index}`} className={styles.whoParagraph}>
                  {paragraph}
                </p>
              ))}
            </div>
            <p className={styles.statement}>
              building things
              <br />
              that serve
              <br />
              purpose.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Activity */}
      <section id="activity" className={styles.section}>
        <Reveal>
          <GitHubActivity />
        </Reveal>
      </section>

    </main>
  );
}
