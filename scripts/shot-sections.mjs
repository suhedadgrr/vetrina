// Doğrulama aracı: her bölümü kaydırıp görünüm (viewport) ekran görüntüsü alır.
// node scripts/shot-sections.mjs <url> <çıktı> [desktop|mobile] [dark|light]
import { chromium } from 'playwright-core';
const [url, out, which = 'desktop', theme = 'dark'] = process.argv.slice(2);
const exe = process.env.CHROME_PATH || '/opt/pw-browsers/chromium';
const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });
const mobile = which === 'mobile';
const ctx = await browser.newContext({
  viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 },
  isMobile: mobile,
  hasTouch: mobile,
});
await ctx.addInitScript((t) => {
  try {
    localStorage.setItem('vt_consent', JSON.stringify({ analytics: false, ts: 1 }));
    localStorage.setItem('vt_theme', t);
  } catch {
    /* yok say */
  }
}, theme);
const page = await ctx.newPage();
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(1800);
const ids = process.env.IDS
  ? process.env.IDS.split(',')
  : [
      'guven',
      'hizmetler',
      'calismalar',
      'showreel',
      'paketler',
      'surec',
      'biz-kimiz',
      'instagram',
      'sss',
      'iletisim',
    ];
await page.screenshot({ path: `${out}/${which}-${theme}-0-hero.png` });
let i = 1;
for (const id of ids) {
  await page.evaluate((id) => {
    const e = document.getElementById(id);
    if (e) scrollTo(0, e.getBoundingClientRect().top + scrollY - 70);
  }, id);
  await page.waitForTimeout(1300);
  await page.screenshot({ path: `${out}/${which}-${theme}-${i++}-${id}.png` });
}
await browser.close();
