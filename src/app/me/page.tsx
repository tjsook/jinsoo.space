import Link from "next/link";
import styles from "../section.module.css";

export default function MePage() {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          <strong>who i am.</strong>
        </h1>
        <p className={styles.body}>My name is Tyler Kim.</p>
        <p className={styles.body}>
          I&apos;m a freshman studying Computer Science at Cal Poly.
        </p>
        <p className={styles.body}>
          I&apos;m from Southern California, the SFV.
        </p>
        <p className={styles.body}>
          I feel so lucky to have such great people in my life.
        </p>
        <p className={styles.body}>
          I really enjoy expressing myself through many different mediums.
        </p>
        <p className={styles.body}>
          I am thoroughly blessed for just the ability to clack my fingers on a
          keyboard,
          <br /> let alone, being able to share the product of my clacking with
          others.
          <br />
        </p>
        <p className={styles.body}>
          Honestly, there isn&apos;t much more to be said here.
        </p>
        <div className={styles.body}>
          <strong>Want to connect and tell me about yourself?</strong> <br />
          <Link href="/lets-talk" className={styles.link}>
            Please, reach out.
          </Link>
        </div>
        <div className={styles.body}>
          <strong>What does my life look like?</strong> <br />
          <Link href="/gallery" className={styles.link}>
            See for yourself.
          </Link>
        </div>
        <div className={styles.body}>
          <strong>What have I been working on?</strong> <br />
          <Link href="/projects" className={styles.link}>
            #buildinpublic
          </Link>
        </div>
        <div className={styles.body}>
          <strong>Want to pick my brain?</strong> <br />
          <Link href="/writings" className={styles.link}>
            Welcome!
          </Link>
        </div>
      </div>
    </main>
  );
}
