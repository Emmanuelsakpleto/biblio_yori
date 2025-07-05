/** @type {import('next').NextConfig} */

const nextConfig = {
  // Configuration pour Docker (standalone)
  output: 'standalone',
  
  images: {
    domains: [
      'api.dicebear.com',
      'images.unsplash.com',
      'plus.unsplash.com',
      'localhost'
    ],
    // Configuration pour Docker
    unoptimized: process.env.NODE_ENV === 'production',
  },
  
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  },
  
  // Optimisations pour la production
  swcMinify: true,
  
  // Configuration pour le serveur
  poweredByHeader: false,
  
  // Gestion des redirections
  async redirects() {
    return [];
  },
};

export default nextConfig;