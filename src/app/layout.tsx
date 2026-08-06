import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import HomeLink from "./home-link";
import VercelAnalytics from "./vercel-analytics";
import styles from "./layout.module.css";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-jetbrains",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
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
        className={`${jetbrainsMono.variable} ${spaceGrotesk.variable} ${styles.body}`}
      >
        <HomeLink />
        {children}
        <VercelAnalytics />
      </body>
    </html>
  );
}
