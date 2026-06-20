/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  
  // Ise 'experimental' se bahar nikaal kar rename kar diya
  serverExternalPackages: ['@better-auth/kysely-adapter', 'kysely'],
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '/**', // '/**' lagana behtar hai
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      }
    ],
  },
};

export default nextConfig;