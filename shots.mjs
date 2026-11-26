// DataNusa — mengambil 4 screenshot situs dengan headless Chromium.
// Menyalakan server statis kecil untuk app/, lalu memotret tiap rute.
// Penggunaan: node shots.mjs  (menulis ke screenshots/)

import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const require = createRequire('/home/hatch/workspace/makefun/node_modules/playwright-core/package.json');
const { chromium } = require('playwright-core');

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, 'app');

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
};

const server = createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const file = join(root, path === '/' ? 'index.html' : path);
  try {
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream' });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
});

const shots = [
  { file: '1-dashboard.jpg', path: '#/', width: 1280, height: 1000 },
  { file: '2-indikator.jpg', path: '#/indikator/pdb', width: 1280, height: 1000 },
  { file: '3-banding.jpg', path: '#/banding', width: 1280, height: 1000 },
  { file: '4-dashboard-phone.jpg', path: '#/', width: 390, height: 844 },
];

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const port = server.address().port;

const browser = await chromium.launch({
  executablePath:
    '/home/hatch/.cache/ms-playwright/chromium-1255/chrome-linux64/chrome',
  args: ['--no-sandbox'],
});

for (const shot of shots) {
  const page = await browser.newPage({
    viewport: { width: shot.width, height: shot.height },
    deviceScaleFactor: 1,
  });
  const errors = [];
  page.on('pageerror', (err) => errors.push(String(err)));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  await page.goto('http://127.0.0.1:' + port + '/' + shot.path, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  const out = join(here, 'screenshots', shot.file);
  await mkdir(join(here, 'screenshots'), { recursive: true });
  await page.screenshot({ path: out, type: 'jpeg', quality: 82 });
  console.log(shot.file, shot.width + 'x' + shot.height, errors.length ? 'ERRORS: ' + errors.join(' | ') : 'ok');
  await page.close();
}

await browser.close();
server.close();
console.log('done');
