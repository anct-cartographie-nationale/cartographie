import createMDX from '@next/mdx';
import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  assetPrefix: process.env.NEXT_ASSET_PREFIX,
  async headers() {
    const assetPrefix = process.env.NEXT_ASSET_PREFIX;
    return [
      ...(assetPrefix
        ? [{ source: '/:path*', headers: [{ key: 'Link', value: `<${assetPrefix}>; rel=preconnect` }] }]
        : []),
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' }
        ]
      },
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

const config = withMDX(nextConfig);

const sentryAuthToken = process.env['SENTRY_AUTH_TOKEN'];
const sentryOrg = process.env['SENTRY_ORG'];
const sentryProject = process.env['SENTRY_PROJECT'];

export default sentryAuthToken
  ? withSentryConfig(config, {
      authToken: sentryAuthToken,
      silent: !process.env['CI'],
      widenClientFileUpload: true,
      disableLogger: true,
      reactComponentAnnotation: { enabled: true },
      sourcemaps: { deleteSourcemapsAfterUpload: true },
      ...(sentryOrg ? { org: sentryOrg } : {}),
      ...(sentryProject ? { project: sentryProject } : {})
    })
  : config;
