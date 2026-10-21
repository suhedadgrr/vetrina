import { track } from './analytics';

export function initInteractions() {
  beforeAfter();
  workModals();
  hoverPreview();
  reel();
}

function beforeAfter() {
  document.querySelectorAll<HTMLElement>('[data-ba]').forEach((root) => {
    const tabs = [...root.querySelectorAll<HTMLButtonElement>('[data-ba-tab]')];
    const panels = [...root.querySelectorAll<HTMLElement>('[data-ba-panel]')];

    const select = (slug: string, focus = false) => {
      tabs.forEach((t) => {
        const on = t.dataset.baTab === slug;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        if (on && focus) t.focus();
      });
      panels.forEach((p) => (p.hidden = p.dataset.baPanel !== slug));
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t.dataset.baTab!));
      t.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        const n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
        select(n.dataset.baTab!, true);
      });
    });

    root.querySelectorAll<HTMLInputElement>('[data-ba-range]').forEach((r) => {
      const stage = r.closest<HTMLElement>('.ba__stage')!;
      const set = () => stage.style.setProperty('--pos', `${r.value}%`);
      r.addEventListener('input', set);
      // Giriş ipucu: sürüklemeden önce hafif bir sallanma (hareket azaltma tercihine saygılı)
      if (
        !matchMedia('(prefers-reduced-motion: reduce)').matches &&
        'IntersectionObserver' in window
      ) {
        const io = new IntersectionObserver(
          ([en]) => {
            if (!en.isIntersecting) return;
            io.disconnect();
            let t = 0;
            const id = setInterval(() => {
              t += 1;
              r.value = String(50 + Math.sin(t / 4) * 18 * (1 - t / 40));
              set();
              if (t >= 40) {
                clearInterval(id);
                r.value = '50';
                set();
              }
            }, 30);
          },
          { threshold: 0.6 },
        );
        io.observe(stage);
      }
    });
  });
}

function workModals() {
  const open = (slug: string, trigger?: HTMLElement) => {
    const d = document.querySelector<HTMLDialogElement>(`[data-work-modal="${slug}"]`);
    if (!d || typeof d.showModal !== 'function') return false;
    d.showModal();
    document.documentElement.style.overflow = 'hidden';
    (d as any)._trigger = trigger;
    return true;
  };
  document.addEventListener('click', (e) => {
    const t = (e.target as Element).closest<HTMLElement>('[data-work-open]');
    if (t && open(t.dataset.workOpen!, t)) e.preventDefault();

    const closeBtn = (e.target as Element).closest('[data-modal-close]');
    if (closeBtn) closeBtn.closest('dialog')?.close();
  });
  document.querySelectorAll<HTMLDialogElement>('dialog.modal').forEach((d) => {
    // Arka plana tıklayınca kapat
    d.addEventListener('click', (e) => {
      if (e.target === d) d.close();
    });
    d.addEventListener('close', () => {
      document.documentElement.style.overflow = '';
      (d as any)._trigger?.focus?.();
    });
  });
  // #calisma-slug ile doğrudan açma
  const m = location.hash.match(/^#calisma-(.+)$/);
  if (m) open(m[1]);
}

/** Kartlarda önizleme videosu (varsa) hover/focus'ta oynar; mobilde yüklenmez. */
function hoverPreview() {
  if (
    !matchMedia('(hover: hover) and (pointer: fine)').matches ||
    matchMedia('(prefers-reduced-motion: reduce)').matches
  )
    return;
  document.querySelectorAll<HTMLElement>('.work-card').forEach((card) => {
    const v = card.querySelector<HTMLVideoElement>('video[data-src]');
    if (!v) return;
    const play = () => {
      if (!v.src) v.src = v.dataset.src!;
      v.play().catch(() => {});
    };
    const stop = () => {
      v.pause();
      v.currentTime = 0;
    };
    card.addEventListener('pointerenter', play);
    card.addEventListener('pointerleave', stop);
    card.addEventListener('focus', play);
    card.addEventListener('blur', stop);
  });
}

/** Showreel: masaüstünde görünür olunca otomatik, sessiz oynar. Mobil/az hareket/veri tasarrufu: poster + oynat düğmesi. */
function reel() {
  const fig = document.querySelector<HTMLElement>('[data-reel]');
  const v = fig?.querySelector<HTMLVideoElement>('[data-reel-video]');
  const btn = fig?.querySelector<HTMLButtonElement>('[data-reel-play]');
  if (!fig || !v || !btn) return;

  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  const auto =
    matchMedia('(min-width: 721px)').matches &&
    !matchMedia('(prefers-reduced-motion: reduce)').matches &&
    !nav.connection?.saveData;

  const attach = () => {
    if (v.dataset.ready) return;
    v.dataset.ready = '1';
    const add = (src: string, type: string) => {
      const s = document.createElement('source');
      s.src = src;
      s.type = type;
      v.appendChild(s);
    };
    add(v.dataset.webm!, 'video/webm');
    add(v.dataset.mp4!, 'video/mp4');
    v.load();
  };
  const play = () => {
    attach();
    v.play()
      .then(() => fig.classList.add('is-playing'))
      .catch(() => fig.classList.remove('is-playing'));
  };

  btn.addEventListener('click', () => {
    play();
    track('reel_play');
  });
  v.addEventListener('click', () => {
    if (v.paused) play();
    else {
      v.pause();
      fig.classList.remove('is-playing');
    }
  });

  if (auto && 'IntersectionObserver' in window) {
    new IntersectionObserver(
      ([en]) => {
        if (en.isIntersecting) play();
        else if (!v.paused) {
          v.pause();
          fig.classList.remove('is-playing');
        }
      },
      { threshold: 0.4 },
    ).observe(fig);
  }
}
