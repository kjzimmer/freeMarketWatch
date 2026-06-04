'use strict';
// Runs after both vite builds. Renders each static route to HTML and writes
// dist/[route]/index.html so Express serves the prerendered file directly.
// The dashboard (/) is intentionally excluded — it has live charts.

const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

// Minimal browser-global stubs so SSR components don't throw.
// useEffect/event listeners are no-ops during renderToString, so only
// synchronous initializers (useState, module-level) need these.
if (typeof window === 'undefined') {
  global.window = {
    innerWidth: 1280,
    addEventListener: () => {},
    removeEventListener: () => {},
    location: { href: 'https://freemarketwatch.world/', pathname: '/' },
    history: { pushState: () => {}, replaceState: () => {} },
  };
  global.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
  global.navigator = { userAgent: 'node' };
  global.document = {
    createElement: () => ({ style: {} }),
    getElementById: () => null,
    addEventListener: () => {},
    removeEventListener: () => {},
    head: { appendChild: () => {}, removeChild: () => {} },
  };
}

const CLIENT_DIR = path.join(__dirname, '../client');
const DIST_DIR    = path.join(CLIENT_DIR, 'dist');
const SSR_DIR     = path.join(CLIENT_DIR, 'dist-ssr');

const ROUTES = [
  {
    path: '/about',
    title: 'About',
    desc: 'What Free Market Watch is and why purchasing power is the only honest benchmark for measuring any asset or currency.',
  },
  {
    path: '/contact',
    title: 'Contact',
    desc: 'Get in touch with Free Market Watch.',
  },
  {
    path: '/lens',
    title: 'The Lens',
    desc: 'The intellectual case for measuring assets in real purchasing power — not dollars. Three components, built from first principles.',
  },
  {
    path: '/lens/fiat',
    title: 'Why the Fiat Lens Distorts',
    desc: 'A six-act series on money, debasement, and the hard money alternative. From first principles to Bitcoin.',
  },
  {
    path: '/lens/fiat/act/1',
    title: 'Act 1: Why Money Exists',
    desc: 'From barter to Bitcoin — the origin story of money and why it matters which kind we use.',
  },
  {
    path: '/lens/fiat/act/2',
    title: 'Act 2: What Makes Good Money',
    desc: 'The properties that separate honest money from instruments that fail at their only job.',
  },
  {
    path: '/lens/fiat/act/3',
    title: 'Act 3: How Fiat Debasement Works',
    desc: 'How the Federal Reserve expands the money supply and what that does to purchasing power.',
  },
  {
    path: '/lens/fiat/act/4',
    title: 'Act 4: The Knock-On Effects',
    desc: 'How bad money distorts investment, destroys savings, and warps economic decision-making over time.',
  },
  {
    path: '/lens/fiat/act/5',
    title: 'Act 5: The Hard Money Alternative',
    desc: 'What a fixed-supply monetary standard looks like and why it produces different outcomes.',
  },
  {
    path: '/lens/fiat/act/6',
    title: 'Act 6: What Bitcoin Is',
    desc: 'Bitcoin as sound money — fixed supply, no authority, and why that matters for purchasing power.',
  },
  {
    path: '/lens/thm',
    title: 'The THM Lens',
    desc: 'THM methodology: 111 years of monetary debasement measured against a fixed-supply benchmark. M2/GDP, three methods, honest tradeoffs.',
  },
  {
    path: '/lens/investing',
    title: 'Investing Through the THM Lens',
    desc: 'How investment analysis changes when hard money is the base position, not a forced choice.',
  },
];

async function prerender() {
  const templatePath = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(templatePath)) {
    console.error('[prerender] dist/index.html not found — run vite build first');
    process.exit(1);
  }
  const template = fs.readFileSync(templatePath, 'utf8');

  const ssrEntry = path.join(SSR_DIR, 'entry-server.mjs');
  if (!fs.existsSync(ssrEntry)) {
    console.error('[prerender] dist-ssr/entry-server.mjs not found — run vite build --ssr first');
    process.exit(1);
  }

  const { render } = await import(pathToFileURL(ssrEntry).href);

  let ok = 0;
  for (const route of ROUTES) {
    try {
      const appHtml = render(route.path);
      const html = template
        .replace(/<title>[^<]*<\/title>/, `<title>${route.title} | Free Market Watch</title>`)
        .replace(/<meta name="description"[^>]*\/>/, `<meta name="description" content="${route.desc}" />`)
        .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

      const outDir = path.join(DIST_DIR, route.path.slice(1));
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, 'index.html'), html);
      console.log(`[prerender] ✓ ${route.path}`);
      ok++;
    } catch (err) {
      console.error(`[prerender] ✗ ${route.path}:`, err.message);
    }
  }

  // SSR bundle is only needed at build time
  fs.rmSync(SSR_DIR, { recursive: true, force: true });

  console.log(`[prerender] ${ok}/${ROUTES.length} routes`);
  if (ok < ROUTES.length) process.exit(1);
}

prerender().catch((err) => {
  console.error('[prerender] fatal:', err);
  process.exit(1);
});
