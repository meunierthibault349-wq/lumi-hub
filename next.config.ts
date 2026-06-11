import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: false },
  serverExternalPackages: ['@react-pdf/renderer'],

  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/:path*',
          destination: '/vitrine/:path*',
          has: [{ type: 'host', value: 'lumi-site.fr' }],
        },
        {
          source: '/:path*',
          destination: '/vitrine/:path*',
          has: [{ type: 'host', value: 'www.lumi-site.fr' }],
        },
      ],
    };
  },
};

export default nextConfig;
