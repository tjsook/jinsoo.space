import type { Metadata } from "next";
import { Inter } from "next/font/google";
import HomeLink from "./home-link";
import VercelAnalytics from "./vercel-analytics";
import styles from "./layout.module.css";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jinsoo.space";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
      <body
        className={`${inter.variable} ${styles.body}`}
      >
        <HomeLink />
        {children}
        <VercelAnalytics />
      </body>
    </html>
  );
}
