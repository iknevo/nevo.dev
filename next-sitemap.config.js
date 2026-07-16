/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://nevo.is-a.dev",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  exclude: ["/admin/*", "/auth/*"],
  robotsTxtPolicies: [
    {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/*", "/auth", "/auth/*"],
    },
  ],
};
