/**
 * GSAP + ScrollTrigger — yalnızca boşta (idle) ve dinamik import ile yüklenir.
 * Kullanım: parallax katmanları, süreç zaman çizgisi çizgisi, showreel ölçeklenmesi.
 */
export async function initMotion(reduce: boolean) {
  const timeline = document.querySelector<HTMLElement>('[data-timeline]');

  if (reduce) {
    // Hareketsiz sürüm: zaman çizgisi tamamen dolu görünür.
    timeline?.style.setProperty('--p', '1');
    timeline?.querySelectorAll('[data-step]').forEach((s) => s.classList.add('is-active'));
    return;
  }

  const [{ gsap }, { ScrollTrigger }] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
  ]);
  gsap.registerPlugin(ScrollTrigger);
  const mm = gsap.matchMedia();

  // Parallax: masaüstünde tam, mobilde hafifletilmiş
  mm.add('(min-width: 721px)', () => {
    document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
      const k = Number(el.dataset.parallax) || 0.1;
      gsap.to(el, {
        yPercent: k * 120,
        ease: 'none',
        scrollTrigger: {
          trigger: el.closest('section') ?? el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.6,
        },
      });
    });
  });
  mm.add('(max-width: 720px)', () => {
    document.querySelectorAll<HTMLElement>('.orb[data-parallax]').forEach((el) => {
      const k = Number(el.dataset.parallax) || 0.1;
      gsap.to(el, {
        yPercent: k * 60,
        ease: 'none',
        scrollTrigger: {
          trigger: el.closest('section') ?? el,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    });
  });

  // Süreç zaman çizgisi: kaydırdıkça dolar, adımlar sırayla aktifleşir
  if (timeline) {
    const steps = [...timeline.querySelectorAll<HTMLElement>('[data-step]')];
    ScrollTrigger.create({
      trigger: timeline,
      start: 'top 70%',
      end: 'bottom 55%',
      scrub: 0.4,
      onUpdate: (self) => {
        timeline.style.setProperty('--p', String(self.progress));
        steps.forEach((s, i) =>
          s.classList.toggle('is-active', self.progress >= (i + 0.2) / steps.length),
        );
      },
    });
  }

  // Showreel çerçevesi: kaydırırken hafifçe büyür
  document.querySelectorAll<HTMLElement>('[data-parallax-scale]').forEach((el) => {
    gsap.fromTo(
      el,
      { scale: 0.92, borderRadius: 40 },
      {
        scale: 1,
        borderRadius: 18,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 35%', scrub: 0.5 },
      },
    );
  });

  // İçerik yüklendikten sonra yerleşimler oturur
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
}
