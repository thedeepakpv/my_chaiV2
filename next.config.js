// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Optional: Add a trailing slash to all paths
  trailingSlash: true,
  // Optional: Change the output directory to 'out' for static export
  distDir: 'out',
  // Optional: Configure image optimization
  images: {
    unoptimized: true, // Disable image optimization for static export
  },
  // Optional: Add base path if your site is hosted in a subdirectory
  // basePath: '/my-chai',
};

module.exports = nextConfig;
