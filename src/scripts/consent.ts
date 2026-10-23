// Banner de cookies propio + Consent Mode v2.
// El estado por defecto ("denied") se fija en <head> antes de GTM (BaseLayout). Aquí solo se actualiza.
type Choice = { analytics: boolean; ads: boolean; ts: number };
const KEY = 'sa_consent';

function gtag(..._args: unknown[]): void {
  window.dataLayer = window.dataLayer || [];
  // Consent Mode exige el objeto `arguments`, no un array.
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
}

export function getConsent(): Choice | null {
  try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; }
}

function apply(c: Choice): void {
  const g = (b: boolean) => (b ? 'granted' : 'denied');
  gtag('consent', 'update', {
    ad_storage: g(c.ads), ad_user_data: g(c.ads), ad_personalization: g(c.ads), analytics_storage: g(c.analytics),
  });
  window.dataLayer.push({ event: 'consent_update', consent_analytics: c.analytics, consent_ads: c.ads });
}

export function initConsent(): void {
  const box = document.getElementById('consent');
  if (!box) return;
  const panel = box.querySelector<HTMLElement>('[data-consent-panel]')!;
  const chkA = box.querySelector<HTMLInputElement>('[name="c_analytics"]')!;
  const chkM = box.querySelector<HTMLInputElement>('[name="c_ads"]')!;

  const save = (analytics: boolean, ads: boolean) => {
    const c = { analytics, ads, ts: Date.now() };
    try { localStorage.setItem(KEY, JSON.stringify(c)); } catch { /* modo privado */ }
    apply(c);
    box.hidden = true;
    document.body.classList.remove('has-consent');
  };
  const open = (config = false) => {
    const c = getConsent();
    chkA.checked = c?.analytics ?? true;
    chkM.checked = c?.ads ?? true;
    panel.hidden = !config;
    box.hidden = false;
    document.body.classList.add('has-consent');
  };

  box.addEventListener('click', (e) => {
    const action = (e.target as HTMLElement).closest<HTMLElement>('[data-consent]')?.dataset.consent;
    if (action === 'accept') save(true, true);
    else if (action === 'reject') save(false, false);
    else if (action === 'config') { panel.hidden = !panel.hidden; }
    else if (action === 'save') save(chkA.checked, chkM.checked);
  });
  document.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('[data-consent-open]')) { e.preventDefault(); open(true); }
  });

  if (!getConsent()) open(false);
}
