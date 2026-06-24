import type { NextConfig } from "next";

const strapiUrl = new URL(process.env.STRAPI_API_URL ?? "http://localhost:1337");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL(`${strapiUrl.origin}/uploads/**`)],
  },
  async redirects() {
    return [
      {
        source: "/brach-1",
        destination: "/branches/branch-1",
        permanent: false,
      },
      {
        source: "/branch-1",
        destination: "/branches/branch-1",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
