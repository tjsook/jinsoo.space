"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminStar from "./admin-star";
import styles from "./page.module.css";

const NAV_LINKS = [
  { href: "/#who", label: "who i am" },
  { href: "/writings", label: "writings" },
  { href: "/projects", label: "projects" },
];

/**
 * The one header every page shares. On the homepage the mark is the admin star;
 * everywhere else it is the same mark as a link back home.
 */
export default function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className={styles.topBar}>
      <div className={styles.topBarLeft}>
        {isHome ? (
          <>
            <AdminStar />
            <span className={styles.siteName}>jinsoo.space</span>
          </>
        ) : (
          <Link href="/" className={styles.homeMark}>
            <Image src="/favicon.ico" alt="" width={18} height={18} priority />
            <span className={styles.siteName}>jinsoo.space</span>
          </Link>
        )}
      </div>

      <nav className={styles.topNav}>
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={[
              styles.navLink,
              link.href.startsWith("/#") === false &&
              pathname.startsWith(link.href)
                ? styles.navLinkActive
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
