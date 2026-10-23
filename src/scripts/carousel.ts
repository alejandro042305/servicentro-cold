// 4.11 Carrusel [BTO]: scroll-snap + scrollTo smooth, autoplay 5000 ms, pausa en hover/toque/foco.
// `media`: solo se activa cuando la media query se cumple (casos en escritorio, testimonios en móvil).
export function initCarousel(root: HTMLElement, media: string): void {
  const track = root.querySelector<HTMLElement>('[data-track-el]');
  if (!track) return;
  const mq = matchMedia(media);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dots = [...root.querySelectorAll<HTMLButtonElement>('[data-dot]')];
  let timer = 0;
  let paused = false;

  const slides = () => [...track.children] as HTMLElement[];
  const current = () => Math.round(track.scrollLeft / Math.max(1, track.clientWidth));
  const go = (i: number) => {
    const n = slides().length;
    const idx = (i + n) % n;
    track.scrollTo({ left: slides()[idx].offsetLeft - track.offsetLeft, behavior: reduce ? 'auto' : 'smooth' });
  };
  const syncDots = () => dots.forEach((d, i) => d.setAttribute('aria-current', String(i === current())));

  root.querySelector('[data-prev]')?.addEventListener('click', () => go(current() - 1));
  root.querySelector('[data-next]')?.addEventListener('click', () => go(current() + 1));
  dots.forEach((d, i) => d.addEventListener('click', () => go(i)));
  track.addEventListener('scroll', () => requestAnimationFrame(syncDots), { passive: true });

  const stop = () => { clearInterval(timer); timer = 0; };
  const start = () => {
    stop();
    if (reduce || paused || !mq.matches) return;
    timer = window.setInterval(() => go(current() + 1), 5000);
  };
  for (const ev of ['mouseenter', 'focusin', 'touchstart']) root.addEventListener(ev, () => { paused = true; stop(); }, { passive: true });
  for (const ev of ['mouseleave', 'focusout']) root.addEventListener(ev, () => { paused = false; start(); });
  mq.addEventListener('change', start);

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop())).observe(root);
  }
  syncDots();
}
