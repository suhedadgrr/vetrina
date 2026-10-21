import fs from 'node:fs';
import { chromium } from 'playwright-core';

/** Sistemdeki Chromium/Chrome'u bulur (CI: google-chrome; bu ortam: /opt/pw-browsers/chromium). */
export function chromePath() {
  const c = [
    process.env.CHROME_PATH,
    '/opt/pw-browsers/chromium',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ];
  return c.find((p) => p && fs.existsSync(p));
}
export const launch = () =>
  chromium.launch({ executablePath: chromePath(), args: ['--no-sandbox'] });
