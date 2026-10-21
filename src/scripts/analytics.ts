/** Çerez onayı + Plausible (yalnızca onayla yüklenir) + dönüşüm olayları. */
type Consent = { analytics: boolean; ts: number };
const KEY = 'vt_consent';

declare global {
  interface Window {
    plausible?: ((...a: unknown[]) => void) & { q?: unknown[][] };
  }
}

function read(): Consent | null {
  try {
    const v = localStorage.getItem(KEY);
    return v ? (JSON.parse(v) as Consent) : null;
  } catch {
    return null;
  }
}
function write(analytics: boolean) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ analytics, ts: Date.now() }));
  } catch {
    /* yok say */
  }
}

let loaded = false;
function loadPlausible() {
  if (loaded) return;
  const { plausibleDomain, plausibleSrc } = document.body.dataset;
  if (!plausibleDomain) return;
  loaded = true;
  window.plausible =
    window.plausible ||
    Object.assign((...a: unknown[]) => {
      (window.plausible!.q = window.plausible!.q || []).push(a);
    }, {});
  const s = document.createElement('script');
  s.defer = true;
  s.src = plausibleSrc || 'https://plausible.io/js/script.tagged-events.js';
  s.dataset.domain = plausibleDomain;
  document.head.appendChild(s);
}

/** Dönüşüm olayı gönder (onay yoksa hiçbir şey yapmaz). */
export function track(name: string, props?: Record<string, string>) {
  const c = read();
  if (!c?.analytics) return;
  loadPlausible();
  window.plausible?.(name, props ? { props } : undefined);
}

export function initConsent() {
  const box = document.querySelector<HTMLElement>('[data-cookie]');
  const c = read();
  if (c?.analytics) loadPlausible();

  if (box) {
    const opts = box.querySelector<HTMLElement>('[data-cookie-opts]')!;
    const chk = box.querySelector<HTMLInputElement>('[data-cookie-analytics]')!;
    const toggle = box.querySelector<HTMLButtonElement>('[data-cookie-toggle]')!;
    const save = box.querySelector<HTMLButtonElement>('[data-cookie-save]')!;
    const close = (a: boolean) => {
      write(a);
      box.hidden = true;
      if (a) loadPlausible();
    };
    const open = () => {
      chk.checked = !!read()?.analytics;
      box.hidden = false;
    };

    if (!c) setTimeout(open, 1200);
    box.querySelector('[data-cookie-accept]')!.addEventListener('click', () => close(true));
    box.querySelector('[data-cookie-reject]')!.addEventListener('click', () => close(false));
    toggle.addEventListener('click', () => {
      const show = opts.hidden;
      opts.hidden = !show;
      save.hidden = !show;
      toggle.setAttribute('aria-expanded', String(show));
    });
    save.addEventListener('click', () => close(chk.checked));
    document
      .querySelectorAll('[data-open-cookie]')
      .forEach((b) => b.addEventListener('click', open));
  }

  // data-track="olay_adı" olan her tıklama için dönüşüm olayı
  document.addEventListener('click', (e) => {
    const el = (e.target as Element).closest<HTMLElement>('[data-track]');
    if (!el) return;
    const name = el.dataset.track!;
    const where = el.dataset.trackWhere;
    track(name, where ? { where } : undefined);
  });
}
