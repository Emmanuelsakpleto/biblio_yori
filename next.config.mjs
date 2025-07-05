/** @type {import('next').NextConfig} */

const nextConfig = {
  // Ne pas utiliser standalone sur Vercel
  // output: 'standalone',
  
  images: {
    domains: [
      'api.dicebear.com',
      'images.unsplash.com',
      'plus.unsplash.com',
      'localhost'
    ],
    // Optimiser les images sauf pour Docker local
    unoptimized: process.env.NODE_ENV === 'development' && process.env.DOCKER_ENV === 'true',
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