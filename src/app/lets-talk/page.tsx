import CopyEmailLink from "./copy-email-link";
import PageShell from "../page-shell";
import styles from "../section.module.css";

export default function LetsTalkPage() {
  return (
    <PageShell title="let's talk" eyebrow="(01) contact">
      <p className={`${styles.body} ${styles.tightBody}`}>
        <em>#anticontactform</em>
      </p>

      <a
        href="https://www.linkedin.com/in/tyjkim"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.link}
      >
        linkedin
      </a>
      <CopyEmailLink />
      <a
        href="https://www.strombergschickens.com/live-birds-eggs/pigeons-doves/?srsltid=AfmBOop4oGklVR03yiiU3ARWs7iPkNznOm1RyuUgKM0zLO9APm7w71MR"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.link}
      >
        carrier pigeon
      </a>
    </PageShell>
  );
}
