const basePath = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

module.exports = {
  siteUrl: basePath,
  changefreq: 'weekly',
  priority: 0.5,
  autoLastmod: true,
  exclude: ['/404', '/500', '/account'],
  transform: async (config, path) => {
    // You can perform async operations here if needed
    // For example, fetching last modified date from a database
    // const lastModified = await fetchLastModifiedFromDB(path);

    var prio = config.priority || 0.7;

    if (path === '/') {
      prio = 0.9;
    } else if (path.includes('/blog')) {
      prio = 0.7;
    } else if (path.includes('/signin')) {
      prio = 0.3;
    }

    return {
      loc: path,
      changefreq: config.changefreq,
      priority: prio,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined
    };
  }
};
