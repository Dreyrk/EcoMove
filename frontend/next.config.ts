import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["*.railway.app"],
  crossOrigin: "use-credentials",
};

export default nextConfig;
