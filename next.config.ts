import type { NextConfig } from "next";

// Archive images are served from Supabase storage and resized by next/image.
const supabaseHost = process.env.SUPABASE_URL
  ? new URL(process.env.SUPABASE_URL).hostname
  : null;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseHost
      ? [
          {
            protocol: "https",
            hostname: supabaseHost,
            pathname: "/storage/v1/object/public/expression/**",
          },
        ]
      : [],
  },
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    return [
      {
        source: "/booking",
        destination: "https://calendar.app.google/irByoyvrKeWsukSC6",
        permanent: false,
      },
      {
        source: "/let's-talk",
        destination: "/lets-talk",
        permanent: true,
      },
      {
        source: "/let’s-talk",
        destination: "/lets-talk",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
