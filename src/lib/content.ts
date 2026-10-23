import { getCollection, type CollectionEntry } from 'astro:content';
import type { Caso } from '../components/sections/CaseStudies.astro';

export const toCaso = (e: CollectionEntry<'casos'>): Caso & { tipo: string } => ({ slug: e.id, ...e.data });

/** Casos publicados (sin borradores), destacados primero. `incluirBorradores` solo para /_kit/. */
export async function getCasos(opts: { tipo?: string; incluirBorradores?: boolean } = {}) {
  const all = await getCollection('casos', (e) => (opts.incluirBorradores || !e.data.borrador) && (!opts.tipo || e.data.tipo === opts.tipo));
  return all.sort((a, b) => Number(b.data.destacado) - Number(a.data.destacado)).map(toCaso);
}
