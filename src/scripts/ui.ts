const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initUI() {
  header();
  theme();
  reveal();
  counters();
  dock();
  prefill();
  utm();
  if (fine && !reduce) {
    cursor();
    tilt();
    heroSpot();
  }
}

function header() {
  const h = document.querySelector<HTMLElement>('[data-header]');
  if (!h) return;
  const on = () => h.classList.toggle('is-stuck', window.scrollY > 24);
  on();
  window.addEventListener('scroll', on, { passive: true });

  const btn = h.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const menu = h.querySelector<HTMLElement>('[data-mobile-menu]');
  if (!btn || !menu) return;
  const set = (open: boolean) => {
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
    menu.hidden = !open;
    h.classList.toggle('is-stuck', open || window.scrollY > 24);
  };
  btn.addEventListener('click', () => set(menu.hidden === true));
  menu.addEventListener('click', (e) => {
    if ((e.target as Element).closest('a')) set(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.hidden) {
      set(false);
      btn.focus();
    }
  });
}

function theme() {
  document.querySelector('[data-theme-toggle]')?.addEventListener('click', () => {
    const root = document.documentElement;
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    document
      .querySelector('meta[name=theme-color]')
      ?.setAttribute('content', next === 'light' ? '#f6f7fd' : '#0a0f2c');
    try {
      localStorage.setItem('vt_theme', next);
    } catch {
      /* yok say */
    }
  });
}

function reveal() {
  const els = document.querySelectorAll<HTMLElement>('.reveal');
  if (!('IntersectionObserver' in window) || reduce) {
    els.forEach((e) => e.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const en of entries)
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );
  els.forEach((e) => io.observe(e));
}

function counters() {
  const els = document.querySelectorAll<HTMLElement>('[data-count]');
  if (!els.length || reduce || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(
    (entries) => {
      for (const en of entries) {
        if (!en.isIntersecting) continue;
        io.unobserve(en.target);
        const el = en.target as HTMLElement;
        const to = Number(el.dataset.count);
        const t0 = performance.now();
        const dur = 1400;
        const step = (t: number) => {
          const p = Math.min(1, (t - t0) / dur);
          el.textContent = String(Math.round(to * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(step);
        };
        el.textContent = '0';
        requestAnimationFrame(step);
      }
    },
    { threshold: 0.6 },
  );
  els.forEach((e) => io.observe(e));
}

/** Mobil alt çubuk: iletişim formu görünürken gizlenir. */
function dock() {
  const dock = document.querySelector<HTMLElement>('[data-dock]');
  const form = document.getElementById('iletisim');
  if (!dock || !form || !('IntersectionObserver' in window)) return;
  new IntersectionObserver(([e]) => dock.classList.toggle('is-hidden', e.isIntersecting), {
    threshold: 0.15,
  }).observe(form);
}

/** data-prefill="..." taşıyan CTA'lar formdaki hizmet seçimini önceden doldurur. */
function prefill() {
  const sel = document.querySelector<HTMLSelectElement>('[data-service-select]');
  if (!sel) return;
  document.addEventListener('click', (e) => {
    const a = (e.target as Element).closest<HTMLElement>('[data-prefill]');
    if (!a) return;
    const v = a.dataset.prefill!.toLowerCase();
    const opt = [...sel.options].find(
      (o) =>
        o.value &&
        (v.includes(o.value.toLowerCase().split(' ')[0]) ||
          o.value.toLowerCase().includes(v.split(' ')[0])),
    );
    if (opt) sel.value = opt.value;
  });
}

/** UTM parametrelerini oturumda sakla; form gönderimine ekle. */
function utm() {
  try {
    const q = new URLSearchParams(location.search);
    const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
    const cur: Record<string, string> = JSON.parse(sessionStorage.getItem('vt_utm') || '{}');
    let changed = false;
    keys.forEach((k) => {
      const v = q.get(k);
      if (v) {
        cur[k] = v;
        changed = true;
      }
    });
    if (changed) sessionStorage.setItem('vt_utm', JSON.stringify(cur));
    const str = Object.entries(JSON.parse(sessionStorage.getItem('vt_utm') || '{}'))
      .map(([k, v]) => `${k}=${v}`)
      .join('&');
    document.querySelectorAll<HTMLInputElement>('[data-utm]').forEach((i) => (i.value = str));
    document
      .querySelectorAll<HTMLInputElement>('[data-page]')
      .forEach((i) => (i.value = location.href));
  } catch {
    /* yok say */
  }
}

function cursor() {
  const c = document.querySelector<HTMLElement>('.cursor');
  if (!c) return;
  document.documentElement.classList.add('has-cursor');
  let x = -100,
    y = -100,
    rx = x,
    ry = y;
  c.classList.add('is-hidden');
  window.addEventListener(
    'pointermove',
    (e) => {
      x = e.clientX;
      y = e.clientY;
      c.classList.remove('is-hidden');
    },
    { passive: true },
  );
  document.addEventListener('pointerleave', () => c.classList.add('is-hidden'));
  document.addEventListener('pointerover', (e) => {
    c.classList.toggle(
      'is-active',
      !!(e.target as Element).closest('a, button, summary, [data-tilt], input[type=range]'),
    );
  });
  const loop = () => {
    rx += (x - rx) * 0.2;
    ry += (y - ry) * 0.2;
    c.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
    requestAnimationFrame(loop);
  };
  loop();
}

/** Kullanıcı isteğiyle kapalı: butonlar imleci takip etmesin. İstenirse yukarıda tekrar çağırın. */
export function magnetic() {
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${(e.clientX - (r.left + r.width / 2)) * 0.22}px`);
      el.style.setProperty('--my', `${(e.clientY - (r.top + r.height / 2)) * 0.28}px`);
    });
    el.addEventListener('pointerleave', () => {
      el.style.setProperty('--mx', '0px');
      el.style.setProperty('--my', '0px');
    });
  });
}

function tilt() {
  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((el) => {
    const max = el.classList.contains('win') ? 8 : 6;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty('--ry', `${(px * max).toFixed(2)}deg`);
      el.style.setProperty('--rx', `${(-py * max).toFixed(2)}deg`);
    });
    el.addEventListener('pointerleave', () => {
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
    });
  });
}

function heroSpot() {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  const spot = hero?.querySelector<HTMLElement>('[data-spot]');
  if (!hero || !spot) return;
  hero.addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect();
    spot.style.setProperty('--sx', `${e.clientX - r.left}px`);
    spot.style.setProperty('--sy', `${e.clientY - r.top}px`);
    hero.classList.add('is-pointer');
  });
  hero.addEventListener('pointerleave', () => hero.classList.remove('is-pointer'));
}
