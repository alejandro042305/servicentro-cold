// Eventos de dataLayer para GTM → GA4 + conversiones de Google Ads.
// Delegación: cualquier enlace wa.me / tel: / mailto: se mide aunque no tenga data-track.
// data-track="evento" · data-servicio · data-ubicacion (en el elemento o en un ancestro) · data-intent
type Params = Record<string, unknown>;
declare global { interface Window { dataLayer: unknown[] } }

export function track(event: string, params: Params = {}): void {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}

const ctx = (el: Element, key: string): string | undefined =>
  (el.closest(`[data-${key}]`) as HTMLElement | null)?.dataset[key];

export function initTracking(): void {
  const servicioPagina = document.body.dataset.servicio || 'general';

  document.addEventListener('click', (ev) => {
    const el = (ev.target as Element).closest<HTMLElement>('a, button, [data-track]');
    if (!el) return;
    const href = el.getAttribute('href') || '';
    let event = el.dataset.track;
    if (!event) {
      if (href.startsWith('https://wa.me')) event = 'whatsapp_click';
      else if (href.startsWith('tel:')) event = 'phone_click';
      else if (href.startsWith('mailto:')) event = 'email_click';
    }
    if (!event) return;
    const params: Params = {
      servicio: ctx(el, 'servicio') || servicioPagina,
      ubicacion: ctx(el, 'ubicacion') || 'otro',
    };
    if (el.dataset.intent) params.intent = el.dataset.intent;
    track(event, params);
  });

  // faq_open: el evento toggle no burbujea, se escucha en fase de captura.
  document.addEventListener('toggle', (ev) => {
    const d = ev.target as HTMLDetailsElement;
    if (d.tagName === 'DETAILS' && d.open && d.hasAttribute('data-faq')) {
      track('faq_open', { pregunta: d.querySelector('summary')?.textContent?.trim().slice(0, 100) });
    }
  }, true);
}
