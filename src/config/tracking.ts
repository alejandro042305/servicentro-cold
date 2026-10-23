import { SITE } from './site';
import { has } from '../lib/data';

const t = SITE.tracking;
/** GTM solo se carga con un ID real (no el marcador GTM-XXXXXXX). */
export const GTM_ID = /^GTM-[A-Z0-9]{4,}$/.test(t.gtmId) && has(t.gtmId) ? t.gtmId : '';
export const TURNSTILE_KEY = has(t.turnstileSiteKey) ? t.turnstileSiteKey : '';
/** Las etiquetas GA4 y Ads se configuran DENTRO de GTM (ver gtm/README.md); aquí solo se documentan. */
export const TRACKING_INFO = { ga4: t.ga4Id, ads: t.adsId, labels: t.adsLabels };
