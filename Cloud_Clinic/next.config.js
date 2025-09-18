/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['your-supabase-project-id.supabase.co'],
  },
};

module.exports = nextConfig;