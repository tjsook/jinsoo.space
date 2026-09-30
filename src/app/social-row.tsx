import CopyEmailInline from "./copy-email-inline";
import styles from "./page.module.css";

const SOCIAL_LINKS = [
  { href: "https://github.com/tjsook", label: "github" },
  { href: "https://x.com/tjkxyz", label: "x" },
  { href: "https://www.linkedin.com/in/tyjkim", label: "linkedin" },
];

const BOOKING_URL = "https://calendar.app.google/irByoyvrKeWsukSC6";

/** The site's only contact block, sitting at the foot of the hero. */
export default function SocialRow({ className = "" }: { className?: string }) {
  return (
    <div className={`${styles.outLinkRow} ${className}`}>
      {SOCIAL_LINKS.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.outLink}
        >
          {link.label}
          <span className={styles.outArrow} aria-hidden="true">
            +
          </span>
        </a>
      ))}
      <CopyEmailInline />
      <a
        href={BOOKING_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.outLink} ${styles.outLinkIcon}`}
        aria-label="Book a call"
        title="Book a call"
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="2" y="6" width="14" height="12" rx="2" />
          <path d="M16 10.5l6-3.5v10l-6-3.5" />
        </svg>
      </a>
    </div>
  );
}
