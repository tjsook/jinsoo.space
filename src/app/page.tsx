import Link from "next/link";
import styles from "./page.module.css";

const entries = [
  { label: "who i am", href: "/me" },
  { label: "writings", href: "/writings" },
  { label: "gallery", href: "/gallery" },
  { label: "projects", href: "/projects" },
  { label: "let's talk", href: "/lets-talk" },
];

export default function Home() {
  return (
    <main className={styles.page}>
      <div className={styles.screenCenteredText}>
        {entries.map((entry) => (
          <Link key={entry.href} href={entry.href} className={styles.entry}>
            <p>{entry.label}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
