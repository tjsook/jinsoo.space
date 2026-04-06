import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import HomeLink from "./home-link";
import styles from "./layout.module.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "jinsoo.space",
  description: "my place to be tyler",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={styles.body}>
        <HomeLink />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
