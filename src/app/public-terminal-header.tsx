import Image from "next/image";
import Link from "next/link";
import styles from "./section.module.css";

export default function PublicTerminalHeader() {
  return (
    <div className={styles.frameHeader}>
      <Link href="/" className={styles.frameHeaderLink} aria-label="Home">
        <Image src="/favicon.ico" alt="" width={24} height={24} priority />
        <span>jinsoo.space</span>
      </Link>
    </div>
  );
}
