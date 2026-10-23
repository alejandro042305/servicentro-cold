// JSON-LD (schema.org). Solo se incluyen datos reales de SITE: lo pendiente se omite.
import { SITE } from '../config/site';
import { has, redes } from './data';

export function localBusinessLd(site: URL) {
  const ld: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'HVACBusiness',
    '@id': new URL('/#empresa', site).href,
    name: SITE.nombre,
    url: site.href,
    image: new URL('/og/og-default.jpg', site).href,
    areaServed: [{ '@type': 'City', name: 'Bogotá' }, ...SITE.cobertura.map((c) => ({ '@type': 'Place', name: c }))],
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], ...horas(SITE.horario.lunVie) },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', ...horas(SITE.horario.sab) },
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Bogotá', addressRegion: 'Bogotá D.C.', addressCountry: 'CO',
      ...(has(SITE.direccion) ? { streetAddress: SITE.direccion } : {}),
    },
  };
  if (has(SITE.razonSocial)) ld.legalName = SITE.razonSocial;
  if (has(SITE.nit)) ld.taxID = SITE.nit;
  if (has(SITE.telefono)) ld.telephone = SITE.telefono.replace(/\s/g, '');
  if (has(SITE.email)) ld.email = SITE.email;
  if (SITE.geo.lat && SITE.geo.lng) ld.geo = { '@type': 'GeoCoordinates', latitude: SITE.geo.lat, longitude: SITE.geo.lng };
  if (redes.length) ld.sameAs = redes.map(([, u]) => u);
  // AggregateRating solo con reseñas reales verificables (rating + número + enlace público).
  if (has(SITE.ratingGoogle) && has(SITE.numResenasGoogle) && has(SITE.urlResenasGoogle)) {
    ld.aggregateRating = { '@type': 'AggregateRating', ratingValue: SITE.ratingGoogle, reviewCount: SITE.numResenasGoogle, bestRating: 5 };
  }
  return ld;
}

/** "7:00 a. m. – 6:00 p. m." → { opens: "07:00", closes: "18:00" } */
function horas(txt: string) {
  const m = [...txt.matchAll(/(\d{1,2}):(\d{2})\s*([ap])\.?\s*m\./gi)];
  if (m.length < 2) return {};
  const to24 = (h: string, min: string, ap: string) => {
    let n = Number(h) % 12;
    if (ap.toLowerCase() === 'p') n += 12;
    return `${String(n).padStart(2, '0')}:${min}`;
  };
  return { opens: to24(m[0][1], m[0][2], m[0][3]), closes: to24(m[1][1], m[1][2], m[1][3]) };
}

export function serviceLd(site: URL, name: string, description: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    serviceType: name,
    url: new URL(path, site).href,
    provider: { '@id': new URL('/#empresa', site).href },
    areaServed: { '@type': 'City', name: 'Bogotá' },
  };
}
