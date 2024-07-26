const fs = require('fs').promises;
const path = require('path');
const prettier = require('prettier');

// Import the configuration
const config = require('./sitemap.config.js');

// Import Next.js's dynamic import function
const dynamicImport = (modulePath) => import(modulePath);

function isValidRoute(route) {
  return (
    !route.startsWith('/_') &&
    !route.startsWith('/api/') &&
    route !== '/404' &&
    route !== '/_not-found' &&
    route !== '/500' &&
    !route.endsWith('.json') &&
    !route.endsWith('.xml') &&
    !route.endsWith('.png') &&
    !route.endsWith('.jpg') &&
    !route.endsWith('.ico') &&
    !isExcluded(route)
  );
}

function isExcluded(path) {
  return config.exclude.some((pattern) => {
    if (pattern.endsWith('*')) {
      return path.startsWith(pattern.slice(0, -1));
    }
    return path === pattern;
  });
}

async function getDynamicPaths(dynamicRoute) {
  const possiblePaths = [
    // Pages Router
    `./pages/${dynamicRoute}.js`,
    `./pages/${dynamicRoute}.tsx`,
    // App Router
    `./app/${dynamicRoute}/page.js`,
    `./app/${dynamicRoute}/page.tsx`
  ];

  for (const pagePath of possiblePaths) {
    try {
      const pageModule = await dynamicImport(pagePath, { ssr: false });
      if (typeof pageModule.generateStaticParams === 'function') {
        const params = await pageModule.generateStaticParams();
        return params.map((param) => {
          let resolvedRoute = dynamicRoute;
          for (const [key, value] of Object.entries(param)) {
            resolvedRoute = resolvedRoute.replace(`[${key}]`, value);
          }
          return resolvedRoute;
        });
      }
    } catch (error) {
      // If the file doesn't exist or can't be imported, continue to the next possible path
      continue;
    }
  }

  console.warn(
    `No generateStaticParams found for ${dynamicRoute}. Skipping...`
  );
  return [];
}

async function generateSitemap() {
  try {
    const prettierConfig = await prettier.resolveConfig('./.prettierrc.js');

    const pages = new Set();

    // Read the routes manifest
    const manifestPath = path.join(
      process.cwd(),
      '.next',
      'routes-manifest.json'
    );
    const manifestContent = await fs.readFile(manifestPath, 'utf8');
    const manifest = JSON.parse(manifestContent);

    // Add static routes
    manifest.staticRoutes.forEach((route) => {
      if (isValidRoute(route.page)) {
        pages.add(route.page);
      }
    });

    // Handle dynamic routes
    for (const route of manifest.dynamicRoutes) {
      if (isValidRoute(route.page)) {
        const dynamicPaths = await getDynamicPaths(route.page);
        dynamicPaths.forEach((path) => {
          if (isValidRoute(path)) {
            pages.add(path);
          }
        });
      }
    }

    // Generate sitemap items
    const sitemapItems = await Promise.all(
      Array.from(pages).map(async (page) => {
        let transformResult;
        if (config.transform.constructor.name === 'AsyncFunction') {
          transformResult = await config.transform(config, page);
        } else {
          transformResult = config.transform(config, page);
        }

        const { loc, changefreq, priority, lastmod } = transformResult;
        return `
        <url>
          <loc>${`${config.siteUrl}${loc}`}</loc>
          ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
          <changefreq>${changefreq}</changefreq>
          <priority>${priority}</priority>
        </url>
      `;
      })
    );

    const sitemap = `
      <?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${sitemapItems.join('')}
      </urlset>
    `;

    const formatted = await prettier.format(sitemap, {
      ...prettierConfig,
      parser: 'html'
    });

    await fs.writeFile('public/sitemap.xml', formatted);
    console.log('Sitemap generated successfully!');
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
}

generateSitemap();
