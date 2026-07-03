import TerminalHome from "./terminal-home";
import styles from "./page.module.css";

const entries = [
  { label: "who i am", href: "/me", detail: "notes on background and intent" },
  { label: "writings", href: "/writings", detail: "essays, fragments, drafts" },
  { label: "gallery", href: "/gallery", detail: "image folders and contact sheets" },
  { label: "projects", href: "/projects", detail: "shipped work and experiments" },
  { label: "let's talk", href: "/lets-talk", detail: "contact and outbound links" },
];

export default function Home() {
  return (
    <main className={styles.page}>
      <TerminalHome entries={entries} />
    </main>
  );
}
