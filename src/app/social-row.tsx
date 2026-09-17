import CopyEmailInline from "./copy-email-inline";
import styles from "./page.module.css";

const SOCIAL_LINKS = [
  { href: "https://github.com/tjsook", label: "github" },
  { href: "https://x.com/tjkxyz", label: "x" },
  { href: "https://www.linkedin.com/in/tyjkim", label: "linkedin" },
];

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
            ↗
          </span>
        </a>
      ))}
      <CopyEmailInline />
    </div>
  );
}
