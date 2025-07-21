import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: `${process.env.API_BASE_URL || "https://mobilitychallenge-production.up.railway.app"}/:path*`,
      },
    ];
  },
  crossOrigin: "use-credentials",
};

export default nextConfig;
