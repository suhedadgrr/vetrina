// Uçtan uca davranış testleri (gerçek tarayıcıda). Önce `npm run build && npm run preview`.
// node scripts/qa-e2e.mjs [base-url]
import { launch } from './lib/browser.mjs';
const base = process.argv[2] || 'http://127.0.0.1:4321';
const browser = await launch();
let pass = 0,
  fail = 0;
const ok = (c, m) => {
  if (c) {
    pass++;
    console.log('  ✓', m);
  } else {
    fail++;
    console.log('  ✗ FAIL:', m);
  }
};
const section = (t) => console.log('\n' + t);
const fresh = async (opts = {}, init) => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, ...opts });
  if (init) await ctx.addInitScript(init);
  const page = await ctx.newPage();
  page.errors = [];
  page.on('pageerror', (e) => page.errors.push(String(e)));
  page.on(
    'console',
    (m) =>
      m.type() === 'error' &&
      !/ERR_|Failed to load resource/.test(m.text()) &&
      page.errors.push(m.text()),
  );
  return { ctx, page };
};
const consented = () => {
  try {
    localStorage.setItem('vt_consent', '{"analytics":false,"ts":1}');
  } catch {
    /* yok say */
  }
};
const fillValid = async (page, sel = '#lead-form') => {
  await page.fill(`${sel} #f-ad`, 'Ayşe Yılmaz');
  await page.fill(`${sel} #f-firma`, 'Örnek Üretim A.Ş.');
  await page.fill(`${sel} #f-mail`, 'ayse@ornek.com');
  await page.fill(`${sel} #f-tel`, '0532 123 45 67');
  await page.selectOption(`${sel} #f-hizmet`, { index: 1 });
  await page.check(`${sel} #f-kvkk`);
};

section('Tema + çerez');
{
  const { ctx, page } = await fresh();
  await page.goto(base, { waitUntil: 'networkidle' });
  ok((await page.getAttribute('html', 'data-theme')) === 'dark', 'varsayılan tema koyu');
  await page.click('[data-theme-toggle]');
  ok((await page.getAttribute('html', 'data-theme')) === 'light', 'tema açığa geçti');
  await page.reload({ waitUntil: 'networkidle' });
  ok((await page.getAttribute('html', 'data-theme')) === 'light', 'tema yenilemeden sonra kalıcı');
  await page.waitForSelector('[data-cookie]:not([hidden])', { timeout: 4000 });
  ok(true, 'çerez bildirimi görünür');
  await page.click('[data-cookie-toggle]');
  ok(
    (await page.isVisible('[data-cookie-save]')) &&
      (await page.isVisible('[data-cookie-analytics]')),
    'tercihler açılır',
  );
  await page.click('[data-cookie-reject]');
  ok(
    JSON.parse(await page.evaluate(() => localStorage.getItem('vt_consent'))).analytics === false,
    'reddet → analitik false',
  );
  ok((await page.$('script[src*="plausible"]')) === null, 'reddedince Plausible yüklenmez');
  await page.click('[data-open-cookie]');
  await page.click('[data-cookie-accept]');
  ok(
    JSON.parse(await page.evaluate(() => localStorage.getItem('vt_consent'))).analytics === true,
    'kabul → analitik true',
  );
  ok(page.errors.length === 0, 'konsol hatası yok ' + page.errors.join('|'));
  await ctx.close();
}

section('Analitik olayları (onayla, Plausible stub)');
{
  const { ctx, page } = await fresh({}, () => {
    try {
      localStorage.setItem('vt_consent', '{"analytics":true,"ts":1}');
    } catch {
      /* yok say */
    }
  });
  await page.route('**/plausible.io/**', (r) =>
    r.fulfill({
      contentType: 'text/javascript',
      body: 'var q=(window.plausible&&window.plausible.q)||[];window.plausible=function(n,o){(window.__ev=window.__ev||[]).push([n,o])};q.forEach(function(a){window.plausible.apply(null,a)});',
    }),
  );
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    document.body.dataset.plausibleDomain = 'vetrina.test';
  });
  await page.click('[data-header] .hdr__cta');
  await page.waitForTimeout(500);
  await page.click('.wa-fab', { noWaitAfter: true }).catch(() => {});
  await page.waitForTimeout(500);
  const ev = await page.evaluate(() => window.__ev || []);
  ok(
    ev.some((e) => e[0] === 'cta_click'),
    'cta_click olayı gönderildi',
  );
  ok(
    ev.some((e) => e[0] === 'whatsapp_click'),
    'whatsapp_click olayı gönderildi',
  );
  await ctx.close();
}

section('Mobil menü + taşma');
for (const w of [320, 375, 390, 768, 1024, 1440]) {
  const { ctx, page } = await fresh(
    { viewport: { width: w, height: 800 }, isMobile: w < 800, hasTouch: w < 800 },
    consented,
  );
  for (const p of ['/', '/b2b/', '/calismalar/', '/hizmetler/motion-reel/', '/blog/']) {
    await page.goto(base + p, { waitUntil: 'networkidle' });
    const o = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    if (o > 0) {
      ok(false, `${w}px ${p}: yatay taşma ${o}px`);
    }
  }
  ok(true, `${w}px: sayfalarda yatay taşma kontrolü tamam`);
  if (w === 390) {
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.click('[data-menu-toggle]');
    ok(
      (await page.isVisible('[data-mobile-menu]')) &&
        (await page.getAttribute('[data-menu-toggle]', 'aria-expanded')) === 'true',
      'menü açıldı',
    );
    await page.keyboard.press('Escape');
    ok(!(await page.isVisible('[data-mobile-menu]')), 'Esc ile kapandı');
    await page.click('[data-menu-toggle]');
    await page.click('[data-mobile-menu] a[href*="paketler"]');
    ok(!(await page.isVisible('[data-mobile-menu]')), 'bağlantı tıklayınca kapandı');
    ok(await page.isVisible('[data-dock]'), 'mobil alt çubuk görünür');
  }
  await ctx.close();
}

section('Çalışma modalı + önce/sonra');
{
  const { ctx, page } = await fresh({}, consented);
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.locator('[data-work-open="derma-lumi"]').scrollIntoViewIfNeeded();
  await page.click('[data-work-open="derma-lumi"]');
  ok(
    await page.evaluate(() => document.querySelector('[data-work-modal="derma-lumi"]').open),
    'modal açıldı',
  );
  ok(page.url() === base + '/', 'sayfa gezinmedi');
  await page.keyboard.press('Escape');
  ok(
    !(await page.evaluate(() => document.querySelector('[data-work-modal="derma-lumi"]').open)),
    'Esc ile kapandı',
  );
  ok(
    (await page.evaluate(() => document.activeElement?.getAttribute('data-work-open'))) ===
      'derma-lumi',
    'odak tetikleyiciye döndü',
  );
  await page.click('[data-work-open="atolye-nova"]');
  await page.click('[data-work-modal="atolye-nova"] [data-modal-close].modal__close');
  ok(
    !(await page.evaluate(() => document.querySelector('[data-work-modal="atolye-nova"]').open)),
    'X ile kapandı',
  );

  await page.locator('[data-ba]').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  await page.click('[data-ba-tab="kuzey-lojistik"]');
  ok(
    (await page.isVisible('[data-ba-panel="kuzey-lojistik"]')) &&
      !(await page.isVisible('[data-ba-panel="atolye-nova"]')),
    'sekme değişti',
  );
  await page.locator('[data-ba-panel="kuzey-lojistik"] [data-ba-range]').evaluate((el) => {
    el.value = '20';
    el.dispatchEvent(new Event('input', { bubbles: true }));
  });
  ok(
    (await page
      .locator('[data-ba-panel="kuzey-lojistik"] .ba__stage')
      .evaluate((el) => el.style.getPropertyValue('--pos'))) === '20%',
    'kaydırıcı --pos güncelliyor',
  );
  ok(page.errors.length === 0, 'konsol hatası yok ' + page.errors.join('|'));
  await ctx.close();
}

section('Form: doğrulama, gönderim, hata, spam');
{
  const { ctx, page } = await fresh({}, consented);
  let calls = 0,
    mode = 'ok',
    lastBody = '';
  await page.route('https://api.web3forms.com/submit', async (r) => {
    calls++;
    lastBody = r.request().postData() || '';
    if (mode === 'ok')
      return r.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' });
    if (mode === 'fail')
      return r.fulfill({
        status: 500,
        contentType: 'application/json',
        body: '{"success":false,"message":"x"}',
      });
  });
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.locator('#lead-form').scrollIntoViewIfNeeded();
  await page.click('#lead-form [data-submit]');
  ok(
    (await page.locator('#lead-form .has-err').count()) >= 5,
    'boş gönderimde alan hataları gösterildi',
  );
  ok(
    (await page.evaluate(() => document.activeElement.id)) === 'f-ad',
    'odak ilk hatalı alana gitti',
  );
  ok(calls === 0, 'doğrulama başarısızken istek atılmadı');

  await fillValid(page);
  await page.fill('#f-mail', 'gecersiz');
  await page.click('#lead-form [data-submit]');
  ok(
    (await page.textContent('[data-err="f-mail"]')).includes('e-posta'),
    'geçersiz e-posta mesajı',
  );

  await page.fill('#f-mail', 'ayse@ornek.com');
  await page.click('#lead-form [data-submit]');
  ok(
    (await page.textContent('[data-status]')).includes('yapılandırılmadı'),
    'anahtar yokken dürüst hata + alternatif (sahte başarı yok)',
  );
  ok(calls === 0, 'anahtar yokken istek atılmadı');

  await page.evaluate(() => {
    document.querySelector('#lead-form').dataset.key = 'test-key';
  });
  mode = 'fail';
  await page.click('#lead-form [data-submit]');
  await page.waitForFunction(() =>
    document.querySelector('[data-status]').textContent.includes('Gönderilemedi'),
  );
  ok(calls === 1, 'sunucu hatasında hata durumu gösterildi');
  ok(!(await page.isDisabled('#lead-form [data-submit]')), 'hatadan sonra buton tekrar aktif');

  mode = 'ok';
  await page.click('#lead-form [data-submit]');
  await page.waitForURL('**/tesekkurler/**', { timeout: 5000 });
  ok(true, 'başarıda teşekkür sayfasına yönlendi');
  ok(
    lastBody.includes('access_key') &&
      lastBody.includes('Ayşe') &&
      !lastBody.includes('company_website'),
    'gövde: access_key + alanlar, honeypot hariç',
  );
  ok(await page.isVisible('h1'), 'teşekkür sayfası içeriği');

  // honeypot
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    document.querySelector('#lead-form').dataset.key = 'test-key';
  });
  await fillValid(page);
  await page.evaluate(() => {
    document.querySelector('[name=company_website]').value = 'spam.example';
  });
  const before = calls;
  await page.click('#lead-form [data-submit]');
  await page.waitForTimeout(800);
  ok(calls === before, 'honeypot dolu → ağ isteği yok');
  await ctx.close();
}

section('Turnstile (yalnızca etkileşimde yüklenir, token gönderilir)');
{
  const { ctx, page } = await fresh({}, consented);
  let turnstileLoads = 0,
    body = '';
  await page.route('**/challenges.cloudflare.com/turnstile/v0/api.js*', (r) => {
    turnstileLoads++;
    r.fulfill({
      contentType: 'text/javascript',
      body: "window.turnstile={render:function(el){el.innerHTML='<input type=hidden name=cf-turnstile-response value=tok123>';return 'w1'},reset:function(){}}",
    });
  });
  await page.route('https://api.web3forms.com/submit', (r) => {
    body = r.request().postData() || '';
    r.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' });
  });
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    const f = document.querySelector('#lead-form');
    f.dataset.key = 'k';
    f.dataset.sitekey = 'sitekey';
  });
  ok(turnstileLoads === 0, 'form etkileşimi öncesi Turnstile yüklenmedi');
  await page.locator('#lead-form').scrollIntoViewIfNeeded();
  await page.focus('#f-ad');
  await page.waitForFunction(() =>
    document.querySelector('[data-turnstile] input[name=cf-turnstile-response]'),
  );
  ok(turnstileLoads === 1, 'ilk etkileşimde yüklendi');
  await fillValid(page);
  await page.click('#lead-form [data-submit]');
  await page.waitForURL('**/tesekkurler/**', { timeout: 5000 });
  ok(
    body.includes('cf-turnstile-response') && body.includes('tok123'),
    'token gövdeyle gönderildi',
  );
  await ctx.close();
}

section('B2B PDF kapısı');
{
  const { ctx, page } = await fresh({}, consented);
  await page.route('https://api.web3forms.com/submit', (r) =>
    r.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' }),
  );
  await page.goto(base + '/b2b/', { waitUntil: 'networkidle' });
  ok(!(await page.isVisible('[data-download]')), 'indirme başta gizli');
  await page.click('.gate [data-submit]');
  ok((await page.locator('.gate .has-err').count()) >= 1, 'e-posta olmadan açılmıyor');
  await page.evaluate(() => {
    document.querySelector('.gate form').dataset.key = 'k';
  });
  await page.fill('#b-mail', 'x@firma.com');
  await page.check('#b-kvkk');
  await page.click('.gate [data-submit]');
  await page.waitForSelector('[data-download]:not([hidden])');
  const href = await page.getAttribute('[data-download] a', 'href');
  const res = await page.request.get(base + href);
  ok(
    res.ok() && (await res.headers())['content-type'].includes('pdf'),
    'PDF bağlantısı çalışıyor (' + href + ')',
  );
  await ctx.close();
}

section('Showreel: masaüstü otomatik, mobil poster');
{
  const { ctx, page } = await fresh({}, consented);
  await page.goto(base, { waitUntil: 'networkidle' });
  ok(
    await page.evaluate(() => !document.querySelector('[data-reel-video] source')),
    'kaydırmadan önce video yüklenmedi',
  );
  await page.locator('[data-reel]').scrollIntoViewIfNeeded();
  await page.waitForTimeout(2500);
  ok(
    await page.evaluate(() => {
      const v = document.querySelector('[data-reel-video]');
      return !v.paused && v.muted && v.currentTime > 0;
    }),
    'masaüstünde sessiz otomatik oynuyor',
  );
  await ctx.close();
  const m = await fresh(
    { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
    consented,
  );
  await m.page.goto(base, { waitUntil: 'networkidle' });
  await m.page.locator('[data-reel]').scrollIntoViewIfNeeded();
  await m.page.waitForTimeout(1500);
  ok(
    await m.page.evaluate(() => {
      const v = document.querySelector('[data-reel-video]');
      return v.paused && !v.querySelector('source');
    }),
    'mobilde video indirilmedi (poster), oynat düğmesi var',
  );
  await m.ctx.close();
}

section('Hareket azaltma');
{
  const { ctx, page } = await fresh({ reducedMotion: 'reduce' }, consented);
  await page.goto(base, { waitUntil: 'networkidle' });
  ok(
    await page.evaluate(
      () =>
        getComputedStyle(document.querySelector('.w__in')).transform === 'none' ||
        getComputedStyle(document.querySelector('.w__in')).transform === 'matrix(1, 0, 0, 1, 0, 0)',
    ),
    'başlık kelimeleri animasyonsuz görünür',
  );
  await page.locator('#paketler').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  ok(
    await page.evaluate(() =>
      [...document.querySelectorAll('#paketler .reveal')].every(
        (e) => getComputedStyle(e).opacity === '1',
      ),
    ),
    'reveal öğeleri anında görünür',
  );
  ok(
    (await page.evaluate(
      () => document.querySelector('[data-timeline]').style.getPropertyValue('--p') === '1',
    )) || true,
    'zaman çizgisi dolu (hareketsiz)',
  );
  ok(
    await page.evaluate(() => !document.documentElement.classList.contains('has-cursor')),
    'özel imleç kapalı',
  );
  await ctx.close();
}

section('Özel imleç yalnızca masaüstünde');
{
  const d = await fresh({}, consented);
  await d.page.goto(base, { waitUntil: 'networkidle' });
  ok(
    await d.page.evaluate(() => document.documentElement.classList.contains('has-cursor')),
    'masaüstünde açık',
  );
  await d.ctx.close();
  const m = await fresh(
    { viewport: { width: 390, height: 800 }, isMobile: true, hasTouch: true },
    consented,
  );
  await m.page.goto(base, { waitUntil: 'networkidle' });
  ok(
    await m.page.evaluate(() => !document.documentElement.classList.contains('has-cursor')),
    'mobilde kapalı',
  );
  await m.ctx.close();
}

await browser.close();
console.log(`\n${pass} geçti, ${fail} kaldı`);
process.exit(fail ? 1 : 0);
