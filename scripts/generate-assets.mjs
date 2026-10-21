/**
 * Üretim varlıkları: OG görselleri, Instagram paylaşım görselleri, B2B örnek PDF, showreel videosu, ikonlar.
 *
 *   npm run assets
 *
 * Şablonlar STUDIO=1 ile ayrı bir klasöre (.studio-dist) derlenir; canlı `dist/` temiz kalır.
 * Gereksinim: Chromium (CHROME_PATH veya /opt/pw-browsers/chromium veya playwright), ffmpeg.
 * Çıktılar `public/` altına yazılır (git'e eklenir) ve bir sonraki build'e dahil olur.
 * Şablonlar: src/pages/studio/**  (noindex, robots'ta engelli)
 */
import { chromium } from 'playwright-core';
import sharp from 'sharp';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { works } from '../content/work.ts';
import { services } from '../content/services.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, '.studio-dist');
const pub = path.join(root, 'public');
const only = new Set(process.argv.slice(2)); // örn: node scripts/generate-assets.mjs og share
const want = (k) => only.size === 0 || only.has(k);
for (const d of ['og', 'share', 'downloads', 'media'])
  fs.mkdirSync(path.join(pub, d), { recursive: true });

console.log('Şablonlar derleniyor (STUDIO=1)…');
execFileSync('npx', ['astro', 'build', '--outDir', '.studio-dist'], {
  cwd: root,
  stdio: 'ignore',
  env: { ...process.env, STUDIO: '1' },
});

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
};
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const f = path.join(dist, p);
  if (!f.startsWith(dist) || !fs.existsSync(f)) {
    res.writeHead(404);
    return res.end();
  }
  res.writeHead(200, { 'Content-Type': mime[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

const exe =
  process.env.CHROME_PATH ||
  (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });
const shoot = async (url, w, h, out, quality = 88) => {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(`${base}${url}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const buf = await page.screenshot({ type: 'png' });
  await sharp(buf).jpeg({ quality, mozjpeg: true }).toFile(out);
  await ctx.close();
  console.log('✓', path.relative(root, out), `${Math.round(fs.statSync(out).size / 1024)} KB`);
};

try {
  if (want('og')) {
    const slugs = [
      'home',
      'calismalar',
      'b2b',
      'blog',
      ...services.map((s) => `hizmet-${s.slug}`),
      ...works.map((w) => `calisma-${w.slug}`),
    ];
    for (const s of slugs)
      await shoot(`/studio/og/${s}/`, 1200, 630, path.join(pub, 'og', `${s}.jpg`), 85);
  }

  if (want('share')) {
    for (const w of works)
      for (const h of [1350, 1920]) {
        await shoot(
          `/studio/share/${w.slug}/${h}/`,
          1080,
          h,
          path.join(pub, 'share', `${w.slug}-1080x${h}.jpg`),
          90,
        );
      }
  }

  if (want('icons')) {
    const svg = fs.readFileSync(path.join(pub, 'favicon.svg'));
    await sharp(svg, { density: 600 })
      .resize(180, 180)
      .flatten({ background: '#0a0f2c' })
      .png()
      .toFile(path.join(pub, 'apple-touch-icon.png'));
    console.log('✓ public/apple-touch-icon.png');
  }

  if (want('pdf')) {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(`${base}/studio/b2b-deck/`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.pdf({
      path: path.join(pub, 'downloads', 'vetrina-b2b-ornek-sunum.pdf'),
      width: '297mm',
      height: '210mm',
      printBackground: true,
      preferCSSPageSize: true,
    });
    await ctx.close();
    console.log('✓ public/downloads/vetrina-b2b-ornek-sunum.pdf');
  }

  if (want('reel')) {
    const FPS = 24,
      D = 9,
      W = 1280,
      H = 720;
    const tmp = fs.mkdtempSync(path.join(process.env.TMPDIR || '/tmp', 'reel-'));
    const ctx = await browser.newContext({
      viewport: { width: W, height: H },
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    await page.goto(`${base}/studio/showreel/?frame`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const n = FPS * D;
    for (let i = 0; i < n; i++) {
      await page.evaluate((t) => window.__render(t), i / FPS);
      await page.screenshot({
        path: path.join(tmp, `f${String(i).padStart(4, '0')}.jpg`),
        type: 'jpeg',
        quality: 92,
      });
      if (i === Math.round(3.9 * FPS))
        fs.copyFileSync(
          path.join(tmp, `f${String(i).padStart(4, '0')}.jpg`),
          path.join(tmp, 'poster.jpg'),
        );
    }
    await ctx.close();
    const inp = [
      '-y',
      '-loglevel',
      'error',
      '-framerate',
      String(FPS),
      '-i',
      path.join(tmp, 'f%04d.jpg'),
    ];
    execFileSync('ffmpeg', [
      ...inp,
      '-c:v',
      'libx264',
      '-preset',
      'slow',
      '-crf',
      '27',
      '-pix_fmt',
      'yuv420p',
      '-movflags',
      '+faststart',
      '-an',
      path.join(pub, 'media', 'showreel.mp4'),
    ]);
    execFileSync('ffmpeg', [
      ...inp,
      '-c:v',
      'libvpx-vp9',
      '-b:v',
      '0',
      '-crf',
      '38',
      '-row-mt',
      '1',
      '-pix_fmt',
      'yuv420p',
      '-an',
      path.join(pub, 'media', 'showreel.webm'),
    ]);
    await sharp(path.join(tmp, 'poster.jpg'))
      .resize(1280)
      .webp({ quality: 80 })
      .toFile(path.join(pub, 'media', 'showreel-poster.webp'));
    fs.rmSync(tmp, { recursive: true, force: true });
    for (const f of ['showreel.mp4', 'showreel.webm', 'showreel-poster.webp'])
      console.log(
        '✓ public/media/' + f,
        `${Math.round(fs.statSync(path.join(pub, 'media', f)).size / 1024)} KB`,
      );
  }
} finally {
  await browser.close();
  server.close();
  fs.rmSync(dist, { recursive: true, force: true });
}
