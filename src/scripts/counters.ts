// 3.13 Contador: de 0 al valor en 2000 ms, ease-out, formato es-CO, al 50 % de visibilidad, una vez.
// El HTML ya trae el valor final (sin JS o con reduced-motion se ve tal cual).
export function initCounters(): void {
  const els = document.querySelectorAll<HTMLElement>('[data-counter]');
  if (!els.length) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;
  const fmt = (n: number, dec: number) =>
    new Intl.NumberFormat('es-CO', { minimumFractionDigits: dec, maximumFractionDigits: dec }).format(n);
  const out = (el: HTMLElement) => el.querySelector<HTMLElement>('[data-counter-value]') || el;
  const run = (el: HTMLElement) => {
    const target = Number(el.dataset.counter);
    const dec = Number(el.dataset.decimals || 0);
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 2000);
      out(el).textContent = fmt(target * (1 - Math.pow(1 - p, 3)), dec);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) { run(e.target as HTMLElement); io.unobserve(e.target); }
    }
  }, { threshold: 0.5 });
  els.forEach((el) => {
    if (el.getBoundingClientRect().top > innerHeight) out(el).textContent = '0';
    io.observe(el);
  });
}
