"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./layout.module.css";

export default function HomeLink() {
  const pathname = usePathname();

  if (pathname === "/" || !pathname.startsWith("/admin")) {
    return null;
  }
  const homeHref = pathname !== "/admin" ? "/admin" : "/";
  const homeLabel = pathname !== "/admin" ? "Admin console" : "Home";

  return (
    <Link href={homeHref} className={styles.homeLink} aria-label={homeLabel}>
      <Image src="/favicon.ico" alt="" width={22} height={22} priority />
      <span className={styles.homeLinkLabel}>jinsoo.space</span>
    </Link>
  );
}
