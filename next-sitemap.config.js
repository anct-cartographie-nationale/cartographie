/** @type {import('next-sitemap').IConfig} */
export default {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cartographie.societenumerique.gouv.fr',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/manifest.webmanifest'],
  outDir: './public',
  changefreq: 'monthly',
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/', disallow: ['/api/'] },
      { userAgent: 'GPTBot', disallow: '/' },
      { userAgent: 'ChatGPT-User', disallow: '/' },
      { userAgent: 'Google-Extended', disallow: '/' },
      { userAgent: 'CCBot', disallow: '/' },
      { userAgent: 'anthropic-ai', disallow: '/' },
      { userAgent: 'ClaudeBot', disallow: '/' },
      { userAgent: 'Bytespider', disallow: '/' },
      { userAgent: 'FacebookBot', disallow: '/' }
    ]
  }
};
