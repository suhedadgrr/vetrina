// Doğrulama aracı: build edilmiş siteyi masaüstü ve mobilde ekran görüntüsüne alır.
// Kullanım: node scripts/shot.mjs <url> <çıktı-klasörü> [full]
import { chromium } from 'playwright-core';
const [url = 'http://127.0.0.1:4321/', out = './shots', full] = process.argv.slice(2);
const exe = process.env.CHROME_PATH || '/opt/pw-browsers/chromium';
const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });
for (const [name, vp, mobile] of [
  ['desktop', { width: 1440, height: 900 }, false],
  ['mobile', { width: 390, height: 844 }, true],
]) {
  const ctx = await browser.newContext({
    viewport: vp,
    deviceScaleFactor: 1,
    isMobile: mobile,
    hasTouch: mobile,
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2200);
  if (full) {
    // reveal'ları tetikle
    const h = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < h; y += 500) {
      await page.evaluate((y) => scrollTo(0, y), y);
      await page.waitForTimeout(120);
    }
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(400);
  }
  await page.screenshot({ path: `${out}/${name}${full ? '-full' : ''}.png`, fullPage: !!full });
  console.log(name, 'errors:', errors);
  await ctx.close();
}
await browser.close();
