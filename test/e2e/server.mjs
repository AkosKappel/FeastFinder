// Serves the generated site like GitHub Pages does: under /FeastFinder/, with 404.html for unknown paths
// and gzip for text files, so Lighthouse measures what visitors get.
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize, relative } from 'node:path';
import { createGzip } from 'node:zlib';

const ROOT = new URL('../../.output/public/', import.meta.url).pathname;
const BASE = '/FeastFinder/';
const PORT = Number(process.env.PORT ?? 4173);
const TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
  '.xml': 'application/xml',
};

const fileFor = async pathname => {
  if (!pathname.startsWith(BASE)) return null;
  let path = join(ROOT, normalize(decodeURIComponent(pathname.slice(BASE.length))));
  if (relative(ROOT, path).startsWith('..')) return null;
  try {
    if ((await stat(path)).isDirectory()) path = join(path, 'index.html');
    await stat(path);
    return path;
  } catch {
    return null;
  }
};

createServer(async (request, response) => {
  const { pathname } = new URL(request.url, 'http://localhost');
  const path = await fileFor(pathname);
  response.statusCode = path ? 200 : 404;
  const file = path ?? join(ROOT, '404.html');
  const type = TYPES[extname(file)] ?? 'application/octet-stream';
  response.setHeader('Content-Type', type);
  if (/text|javascript|json|xml|svg/.test(type) && /\bgzip\b/.test(request.headers['accept-encoding'] ?? '')) {
    response.setHeader('Content-Encoding', 'gzip');
    createReadStream(file).pipe(createGzip()).pipe(response);
  } else {
    createReadStream(file).pipe(response);
  }
}).listen(PORT, () => console.log(`Serving ${ROOT} at http://localhost:${PORT}${BASE}`));
