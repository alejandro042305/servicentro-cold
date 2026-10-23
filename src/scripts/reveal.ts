// 4.1 fadeTop / 4.3 fadeInUp: revela [data-reveal] al entrar en pantalla, una sola vez.
// Stagger: un contenedor con data-reveal-stagger="80" reparte retardos entre sus hijos [data-reveal].
export function initReveal(): void {
  const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!els.length) return;
  document.querySelectorAll<HTMLElement>('[data-reveal-stagger]').forEach((box) => {
    const step = Number(box.dataset.revealStagger) || 80;
    box.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el, i) => {
      el.style.setProperty('--reveal-delay', `${i * step}ms`);
    });
  });
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  els.forEach((el) => io.observe(el));
}
