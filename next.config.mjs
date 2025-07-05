/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: [
      'api.dicebear.com',
      'images.unsplash.com',
      'plus.unsplash.com',
      'localhost'
    ],
  },
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  },
};

export default nextConfig;