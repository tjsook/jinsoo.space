import Link from "next/link";
import PublicTerminalHeader from "../public-terminal-header";
import styles from "../section.module.css";
import pageStyles from "./me.module.css";

export default function MePage() {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <PublicTerminalHeader />
        <div className={styles.frameBody}>
          <h1 className={styles.title}>who i am.</h1>
          <p className={styles.body}>
            My name is Tyler Jinsoo &quot;진수&quot; Kim.
          </p>
          <p className={styles.body}>
            I&apos;m a freshman studying Computer Science at Cal Poly.
          </p>
          <p className={styles.body}>I&apos;m from Southern California.</p>
          <p className={styles.body}>
            I&apos;m currently building GTM pipelines and AI automation systems at{" "}
            <a
              href="https://www.hemut.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.link} ${pageStyles.brandWarm}`}
            >
              Hemut
            </a>
            .
          </p>
          <p className={styles.body}>
            I&apos;m also developing full-stack solutions for organizations at{" "}
            <a
              href="https://calpoly.hack4impact.org/"
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.link} ${pageStyles.brandCool}`}
            >
              H4I - Cal Poly
            </a>
            .
          </p>
          <p className={styles.body}>
            I really enjoy expressing myself through many different mediums.
          </p>
          <div className={styles.body}>
            <strong>Want to connect and tell me about yourself?</strong> <br />
            <Link href="/lets-talk" className={styles.link}>
              Please, reach out.
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
      </div>
    </main>
  );
}
