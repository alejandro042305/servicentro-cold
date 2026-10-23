// Formularios QuickForm / ProjectForm: validación, anti-spam, envío a /api/contacto.php,
// estados del botón y redirección a /gracias/. Si falla la red: WhatsApp con los datos ya escritos.
import { track } from './tracking';
import { getConsent } from './consent';

const BASE = import.meta.env.BASE_URL.replace(/\/?$/, '/');
const API = `${BASE}api/contacto.php`;
const TOKEN_API = `${BASE}api/token.php`;
const TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js';

const MSG = {
  required: 'Este campo es obligatorio.',
  tel: 'Escribe un celular colombiano de 10 dígitos (ej. 3001234567).',
  email: 'Revisa el correo; parece incompleto.',
  min: 'Escribe al menos 2 caracteres.',
  consent: 'Necesitamos tu autorización para contactarte.',
};

let turnstileLoaded = false;
function loadTurnstile(): void {
  if (turnstileLoaded || !document.querySelector('.cf-turnstile')) return;
  turnstileLoaded = true;
  const s = document.createElement('script');
  s.src = TURNSTILE_SRC;
  s.async = true;
  s.defer = true;
  document.head.appendChild(s);
}

async function getToken(form: HTMLFormElement): Promise<void> {
  const input = form.elements.namedItem('form_token') as HTMLInputElement | null;
  if (!input || input.value) return;
  try {
    const r = await fetch(TOKEN_API, { headers: { Accept: 'application/json' }, cache: 'no-store' });
    if (r.ok) input.value = (await r.json()).token || '';
  } catch { /* sin conexión: el servidor decidirá */ }
}

const slug = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function fieldError(field: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, msg: string): void {
  const wrap = field.closest('.field');
  const out = wrap?.querySelector<HTMLElement>('.field__error');
  field.setAttribute('aria-invalid', msg ? 'true' : 'false');
  if (out) out.textContent = msg;
}

function validate(form: HTMLFormElement): boolean {
  let firstBad: HTMLElement | null = null;
  const fields = form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input:not([type=hidden]), select, textarea');
  for (const f of fields) {
    if (f.name === 'empresa_web' || f.closest('.cf-turnstile')) continue;
    let msg = '';
    const v = f.value.trim();
    if (f instanceof HTMLInputElement && f.type === 'checkbox') {
      if (f.required && !f.checked) msg = MSG.consent;
    } else if (f.required && !v) msg = MSG.required;
    else if (v && f.name === 'telefono' && !/^3\d{9}$/.test(v.replace(/\D/g, '').replace(/^57(?=3\d{9}$)/, ''))) msg = MSG.tel;
    else if (v && f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) msg = MSG.email;
    else if (v && f.name === 'nombre' && v.length < 2) msg = MSG.min;
    fieldError(f, msg);
    if (msg && !firstBad) firstBad = f;
  }
  firstBad?.focus();
  return !firstBad;
}

function setState(btn: HTMLButtonElement, state: 'idle' | 'loading' | 'success'): void {
  btn.dataset.state = state;
  btn.disabled = state !== 'idle';
  btn.setAttribute('aria-busy', String(state === 'loading'));
}

function whatsappFallback(form: HTMLFormElement): string {
  const wa = form.dataset.wa || '';
  const d = new FormData(form);
  const partes = ['Hola, intenté enviar el formulario de la web.'];
  for (const [k, label] of [['nombre', 'Nombre'], ['empresa', 'Empresa'], ['telefono', 'Celular'], ['servicio', 'Servicio'],
    ['tipo_proyecto', 'Proyecto'], ['ciudad', 'Ciudad'], ['mensaje', 'Mensaje']] as const) {
    const v = String(d.get(k) || '').trim();
    if (v) partes.push(`${label}: ${v}`);
  }
  return `https://wa.me/${wa}?text=${encodeURIComponent(partes.join('\n'))}`;
}

export function initForms(): void {
  document.querySelectorAll<HTMLFormElement>('form[data-form]').forEach((form) => {
    const kind = form.dataset.form || 'quick';
    const btn = form.querySelector<HTMLButtonElement>('button[type=submit]')!;
    const status = form.querySelector<HTMLElement>('[data-form-status]')!;
    const fail = form.querySelector<HTMLAnchorElement>('[data-form-fallback]');
    let started = false;

    form.addEventListener('focusin', () => {
      if (started) return;
      started = true;
      track('form_start', { form: kind });
      loadTurnstile();
      getToken(form);
    });

    form.addEventListener('input', (e) => {
      const f = e.target as HTMLInputElement;
      if (f.getAttribute('aria-invalid') === 'true') fieldError(f, '');
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.textContent = '';
      if (fail) fail.hidden = true;
      if (!validate(form)) { status.textContent = 'Revisa los campos marcados.'; return; }
      setState(btn, 'loading');
      await getToken(form);
      const data = new FormData(form);
      try {
        const r = await fetch(API, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
        const json = await r.json().catch(() => ({ ok: false }));
        if (!r.ok || !json.ok) throw new Error(r.status === 429 ? 'HTTP 429' : json.error || `HTTP ${r.status}`);
        setState(btn, 'success');
        const servicio = String(data.get('servicio') || data.get('tipo_proyecto') || 'general');
        track('form_submit_success', { form: kind, servicio });
        // Datos para /gracias/ (nombre) y conversiones mejoradas (solo con consentimiento de publicidad).
        const c = getConsent();
        const g: Record<string, string> = { nombre: String(data.get('nombre') || '').split(' ')[0], servicio, form: kind };
        if (c?.ads) {
          g.email = String(data.get('email') || '').trim().toLowerCase();
          g.phone = '+57' + String(data.get('telefono') || '').replace(/\D/g, '').slice(-10);
        }
        try { sessionStorage.setItem('sa_lead', JSON.stringify(g)); } catch { /* sin almacenamiento */ }
        setTimeout(() => { location.href = `${BASE}gracias/?s=${slug(servicio)}`; }, 700);
      } catch (err) {
        setState(btn, 'idle');
        const msg = String((err as Error).message || '');
        status.textContent = msg.startsWith('HTTP 429')
          ? 'Recibimos varios envíos seguidos. Escríbenos por WhatsApp y te atendemos de inmediato.'
          : 'No pudimos enviar el formulario. Tus datos siguen aquí: envíalos por WhatsApp con un clic.';
        if (fail) { fail.href = whatsappFallback(form); fail.hidden = false; }
      }
    });
  });
}
