// 4.6 Rotación/parallax con scroll (solo ≥ 981 px y sin reduced-motion) y 4.15 barra de lectura.
// Atributos: data-parallax · data-y="40" (px) · data-r="45" (grados; negativo = sentido contrario) · data-x="-30" (px)
export function initMotion(): void {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const bar = document.querySelector<HTMLElement>('.read-progress');
  const items = [...document.querySelectorAll<HTMLElement>('[data-parallax]')];
  if (!bar && !items.length) return;
  const desktop = matchMedia('(min-width: 981px)');
  const visible = new Set<HTMLElement>();

  if (items.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const el = e.target as HTMLElement;
        if (e.isIntersecting) visible.add(el); else visible.delete(el);
      }
    });
    items.forEach((el) => io.observe(el));
  }

  let ticking = false;
  const update = () => {
    ticking = false;
    if (bar) {
      const h = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${h > 0 ? Math.min(1, scrollY / h) : 0})`;
    }
    if (reduce || !desktop.matches) return;
    for (const el of visible) {
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight + r.height)));
      const x = Number(el.dataset.x || 0) * p;
      const y = Number(el.dataset.y || 0) * p;
      const rot = Number(el.dataset.r || 0) * p;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rot}deg)`;
    }
  };
  addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
}
