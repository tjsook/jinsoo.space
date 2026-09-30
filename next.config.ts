import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
