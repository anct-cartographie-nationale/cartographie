import createMDX from '@next/mdx';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  assetPrefix: process.env.NEXT_ASSET_PREFIX,
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' }
        ]
      },
      {
        source: '/api/stats/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=21600, s-maxage=21600' }]
      },
      {
        source: '/api/lieux/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=21600' }]
      }
    ];
  },
  async redirects() {
    return [
      { source: '/cartographie', destination: '/', permanent: true },
      { source: '/cartographie/regions', destination: '/', permanent: true },
      { source: '/cartographie/departements', destination: '/', permanent: true },
      { source: '/orientation/:path*', destination: '/', permanent: true },
      { source: '/coordinateurs/:path*', destination: '/', permanent: true },
      { source: '/presentation', destination: 'https://inclusion-numerique.anct.gouv.fr/', permanent: true }
    ];
  }
};

const withMDX = createMDX({
  extension: /\.mdx?$/
});

export default withMDX(nextConfig);
