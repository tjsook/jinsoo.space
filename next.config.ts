import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
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
