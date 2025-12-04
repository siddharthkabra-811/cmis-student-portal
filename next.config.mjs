/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'www.tamu.edu',
      },
      {
        protocol: 'https',
        hostname: 'logos-world.net',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    // unoptimized: false,
  },
};

export default nextConfig;
