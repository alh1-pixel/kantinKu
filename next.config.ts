import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
    return [
      {
        source: "/menu/:id([^/]*\\D[^/]*)",
        destination: "/halaman-tidak-ada",
      },
    ];
  },
};

export default nextConfig;
