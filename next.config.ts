import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    serverActions: {
      // CMS editors upload files through server actions (logo images, media
      // library). The default 1MB cap silently breaks uploads that the
      // editors advertise as allowed up to 10MB; 12mb leaves room for the
      // multipart/form-data overhead on top of a 10MB file.
      bodySizeLimit: "12mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
