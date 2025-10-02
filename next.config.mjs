/** @type {import('next').NextConfig} */
const nextConfig = {
  // Don't use standalone since it requires successful static export
  //output: 'standalone',
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  webpack: (config) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    });
    return config;
  },
};

export default nextConfig;
