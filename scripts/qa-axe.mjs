// Erişilebilirlik denetimi (axe-core): koyu/açık tema, masaüstü/mobil.
// node scripts/qa-axe.mjs <base-url> [yol1,yol2,...]
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const axeSrc = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const [base = 'http://127.0.0.1:4321', paths = '/'] = process.argv.slice(2);
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || '/opt/pw-browsers/chromium',
  args: ['--no-sandbox'],
});
let bad = 0;
for (const p of paths.split(','))
  for (const theme of ['dark', 'light'])
    for (const [name, vp] of [
      ['desktop', { width: 1440, height: 900 }],
      ['mobile', { width: 390, height: 844 }],
    ]) {
      const ctx = await browser.newContext({ viewport: vp });
      await ctx.addInitScript((t) => {
        try {
          localStorage.setItem('vt_theme', t);
          localStorage.setItem('vt_consent', '{"analytics":false,"ts":1}');
        } catch {
          /* yok say */
        }
      }, theme);
      const page = await ctx.newPage();
      await page.goto(base + p, { waitUntil: 'networkidle' });
      // tüm reveal'ları göster, animasyonları bitir
      await page.addStyleTag({
        content:
          '*{animation:none!important;transition:none!important}.reveal{opacity:1!important;transform:none!important}.w__in{transform:none!important}',
      });
      await page.waitForTimeout(400);
      await page.evaluate(axeSrc);
      const res = await page.evaluate(() =>
        axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'] }),
      );
      const v = res.violations.filter((x) => x.impact !== 'minor' || true);
      console.log(`${p} ${theme} ${name}: ${v.length} ihlal`);
      for (const x of v) {
        bad++;
        console.log(
          '  -',
          x.id,
          x.impact,
          x.help,
          '\n    ',
          x.nodes
            .slice(0, 4)
            .map(
              (n) =>
                n.target.join(' ') +
                ' :: ' +
                (n.any[0]?.message || n.failureSummary || '').slice(0, 130),
            )
            .join('\n     '),
        );
      }
      await ctx.close();
    }
await browser.close();
process.exit(bad ? 1 : 0);
