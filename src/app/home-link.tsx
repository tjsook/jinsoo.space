"use client";

import Image from "next/image";
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
      <Image src="/favicon.ico" alt="" width={22} height={22} priority />
    </Link>
  );
}
