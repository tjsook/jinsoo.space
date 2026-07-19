import GitHubActivity from "./github-activity";
import TerminalHome from "./terminal-home";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

const entries = [
  { label: "who i am", href: "/me", detail: "notes on background and intent" },
  { label: "writings", href: "/writings", detail: "essays, fragments, drafts" },
  { label: "projects", href: "/projects", detail: "shipped work and experiments" },
  { label: "let's talk", href: "/lets-talk", detail: "contact and outbound links" },
];

export default function Home() {
  return (
    <main className={styles.page}>
      <TerminalHome entries={entries}>
        <GitHubActivity />
      </TerminalHome>
    </main>
  );
}
