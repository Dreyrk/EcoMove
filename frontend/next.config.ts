import getBaseUrl from "@/utils/getBaseUrl";
import type { NextConfig } from "next";

const baseUrl = getBaseUrl();

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: `${baseUrl || "https://mobilitychallenge-production.up.railway.app"}/:path*`,
      },
    ];
  },
  crossOrigin: "use-credentials",
};

export default nextConfig;
