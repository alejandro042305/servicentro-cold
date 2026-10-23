// Utilidades para leer SITE sin inventar datos.
import { SITE } from '../config/site';

/** true si el valor existe y no es un marcador {{PENDIENTE}} ni un placeholder de tracking. */
export function has(v: unknown): boolean {
  if (v === null || v === undefined) return false;
  if (typeof v === 'number') return Number.isFinite(v) && v > 0;
  if (typeof v === 'string') return v.trim() !== '' && !v.includes('{{') && !/X{5,}/.test(v);
  if (Array.isArray(v)) return v.length > 0;
  return true;
}

/** Devuelve el valor si existe; si no, el texto alternativo (que no debe afirmar nada no verificado). */
export function or(v: string | null | undefined, fallback: string): string {
  return has(v) ? String(v) : fallback;
}

/** Lee una clave de SITE, admite rutas anidadas ("horario.urgencias"). */
export function get(path: string): unknown {
  return path.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown> | undefined)?.[k], SITE);
}

/** Sustituye {clave} por el valor de SITE. Si alguna clave falta, devuelve null (el bloque se oculta). */
export function fill(tpl: string | null | undefined): string | null {
  if (!tpl) return null;
  let missing = false;
  const out = tpl.replace(/\{([\w.]+)\}/g, (_, k: string) => {
    const v = get(k);
    if (!has(v)) { missing = true; return ''; }
    if (Array.isArray(v)) return v.join(', ');
    return typeof v === 'number' ? fmtNum(v) : String(v);
  });
  return missing ? null : out;
}

/** Texto de un ítem de contenido: plantilla rellenada, o su alternativa, o null (se oculta). */
export function txt(item: { texto?: string; alt?: string | null; requiere?: string | string[] } | string): string | null {
  if (typeof item === 'string') return fill(item);
  if (!cumple(item.requiere)) return null;
  return fill(item.texto) ?? item.alt ?? null;
}

/** Filtra ítems cuyo `requiere` no se cumple y cuyos textos no se pueden rellenar. */
export function visibles<T extends { requiere?: string | string[] }>(items: T[], ...campos: (keyof T)[]): T[] {
  return items.filter((i) => cumple(i.requiere) && campos.every((c) => i[c] == null || fill(String(i[c])) !== null));
}

export function fmtNum(n: number): string {
  return new Intl.NumberFormat('es-CO').format(n);
}

/** Comprueba la condición `requiere` de un ítem de contenido (clave de SITE). */
export function cumple(requiere?: string | string[]): boolean {
  if (!requiere) return true;
  const keys = Array.isArray(requiere) ? requiere : [requiere];
  return keys.every((k) => has(get(k)));
}

export function waHref(mensaje = ''): string {
  const base = `https://wa.me/${SITE.whatsapp}`;
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base;
}

export const telHref = SITE.telefonoHref;
export const telVisible = has(SITE.telefono) ? SITE.telefono : '';
export const emailVisible = has(SITE.email) ? SITE.email : '';

export function siteUrl(dominio: string): string {
  // Astro necesita una URL válida para el sitemap y las canónicas.
  return has(dominio) ? dominio : 'https://dominio-pendiente.example';
}

export const redes = Object.entries(SITE.redes).filter(([, url]) => has(url)) as [string, string][];
