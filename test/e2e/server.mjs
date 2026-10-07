// Serves the generated site like GitHub Pages does: under /FeastFinder/, with 404.html for unknown paths.
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize, relative } from 'node:path';

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
  response.setHeader('Content-Type', TYPES[extname(file)] ?? 'application/octet-stream');
  createReadStream(file).pipe(response);
}).listen(PORT, () => console.log(`Serving ${ROOT} at http://localhost:${PORT}${BASE}`));
