"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./layout.module.css";

export default function HomeLink() {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  return (
    <Link href="/" className={styles.homeLink} aria-label="Home">
      home
    </Link>
  );
}
