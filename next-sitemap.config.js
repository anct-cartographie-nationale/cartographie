export const url = (protocol, hostname, port, basePath) =>
  [protocol, '://', hostname, port ? `:${port}` : '', basePath ? basePath.replace(/\/$/, '') : ''].join('');

export const urlFromEnv = () =>
  url(
    process.env.PROTOCOL ?? 'https',
    process.env.HOSTNAME ?? 'localhost',
    process.env.PORT,
    process.env.NEXT_PUBLIC_BASE_PATH
  );

/** @type {import('next-sitemap').IConfig} */
export default {
  siteUrl: urlFromEnv(),
  generateRobotsTxt: true,
  exclude: ['/manifest.webmanifest'],
  outDir: './out',
  changefreq: 'monthly'
};
