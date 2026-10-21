import { initConsent } from './analytics';
import { initUI } from './ui';
import { initInteractions } from './interactions';
import { initForms } from './forms';

initConsent();
initUI();
initInteractions();
initForms();

// Ağır animasyon kütüphanesi (GSAP + ScrollTrigger): ana iş parçacığı boşken yüklenir.
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const needsMotion = document.querySelector(
  '[data-parallax], [data-timeline], [data-parallax-scale]',
);
if (needsMotion) {
  const load = () => import('./motion').then((m) => m.initMotion(reduce));
  if (reduce) {
    load();
  } else if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(load, { timeout: 2500 });
  } else {
    setTimeout(load, 1200);
  }
}
