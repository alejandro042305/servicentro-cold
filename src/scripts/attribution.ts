// Guarda gclid/gbraid/wbraid/utm_* 90 días en la cookie first-party _sa_attr
// y los inserta en los campos ocultos de todos los formularios.
const KEYS = ['gclid', 'gbraid', 'wbraid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
const COOKIE = '_sa_attr';

export function readAttribution(): Record<string, string> {
  const m = document.cookie.match(new RegExp('(?:^|; )' + COOKIE + '=([^;]*)'));
  if (!m) return {};
  try { return JSON.parse(decodeURIComponent(m[1])); } catch { return {}; }
}

export function initAttribution(): void {
  const q = new URLSearchParams(location.search);
  const nuevo: Record<string, string> = {};
  for (const k of KEYS) {
    const v = q.get(k);
    if (v) nuevo[k] = v.slice(0, 200);
  }
  if (Object.keys(nuevo).length) {
    const val = encodeURIComponent(JSON.stringify(nuevo));
    const secure = location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${COOKIE}=${val}; Max-Age=${90 * 24 * 3600}; Path=/; SameSite=Lax${secure}`;
  }
  const attr = { ...readAttribution(), ...nuevo };
  document.querySelectorAll<HTMLFormElement>('form[data-form]').forEach((f) => {
    for (const k of KEYS) {
      const input = f.elements.namedItem(k) as HTMLInputElement | null;
      if (input && attr[k]) input.value = attr[k];
    }
    const pagina = f.elements.namedItem('pagina') as HTMLInputElement | null;
    if (pagina) pagina.value = location.pathname;
  });
}
