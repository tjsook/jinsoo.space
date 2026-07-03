import PublicTerminalHeader from "../public-terminal-header";
import styles from "../section.module.css";

export default function LetsTalkPage() {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <PublicTerminalHeader />
        <div className={styles.frameBody}>
          <h1 className={styles.title}>let&apos;s talk</h1>
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
          <a href="mailto:tylerjsook@gmail.com" className={styles.link}>
            email me
          </a>
          <a
            href="https://www.strombergschickens.com/live-birds-eggs/pigeons-doves/?srsltid=AfmBOop4oGklVR03yiiU3ARWs7iPkNznOm1RyuUgKM0zLO9APm7w71MR"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            carrier pigeon
          </a>
        </div>
      </div>
    </main>
  );
}
