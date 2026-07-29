import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Environment variables are validated at runtime via src/lib/supabase/client.ts
  // No hardcoded values here.
};

export default nextConfig;
