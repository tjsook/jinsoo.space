import Link from "next/link";
import CopyEmailInline from "./copy-email-inline";
import Reveal from "./reveal";
import styles from "./page.module.css";

export const SOCIAL_LINKS = [
  { href: "https://github.com/tjsook", label: "github" },
  { href: "https://x.com/tjkxyz", label: "x" },
  { href: "https://www.linkedin.com/in/tyjkim", label: "linkedin" },
];

export function SocialRow({ className = "" }: { className?: string }) {
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

export default function SiteFooter({ index = "04" }: { index?: string }) {
  return (
    <footer id="contact" className={styles.contact}>
      <Reveal>
        <span className={styles.label}>({index}) contact</span>
        <Link href="/lets-talk" className={styles.contactLine}>
          let&apos;s talk
          <span className={styles.contactArrow} aria-hidden="true">
            ↗
          </span>
        </Link>
        <p className={styles.contactNote}>#anticontactform</p>
        <SocialRow className={styles.contactLinks} />
      </Reveal>

      <div className={styles.footMeta}>
        <span>© {new Date().getFullYear()}</span>
        <span>tyler jinsoo kim</span>
        <span>jinsoo.space</span>
      </div>
    </footer>
  );
}
