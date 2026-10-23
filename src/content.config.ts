// Colecciones de contenido en Markdown (Astro 5 content layer).
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const casos = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/casos' }),
  schema: z.object({
    titulo: z.string(),
    tipo: z.enum(['Aire', 'Cuarto frío', 'Chiller', 'Mantenimiento']),
    sector: z.string(),
    ubicacion: z.string().optional(),
    problema: z.string(),
    solucion: z.string(),
    resultado: z.string(),
    datos: z.array(z.string()).default([]),
    foto: z.string(),
    fotoAlt: z.string(),
    destacado: z.boolean().default(false),
    /** true = ejemplo de formato: no se publica, solo aparece en /_kit/. */
    borrador: z.boolean().default(false),
  }),
});

const faqItem = z.object({ q: z.string(), a: z.string(), requiere: z.union([z.string(), z.array(z.string())]).optional() });

const landings = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/landings' }),
  schema: z.object({
    titulo: z.string(),
    descripcion: z.string(),
    servicio: z.enum(['reparacion-mantenimiento', 'instalacion', 'aire-acondicionado', 'cuartos-frios', 'chillers']),
    canonical: z.string(),
    eyebrow: z.string(),
    h1: z.string(),
    /** ?kw=clave → H1 alternativo (lista blanca, nunca texto libre de la URL). */
    kw: z.record(z.string()).default({}),
    lead: z.string(),
    promesas: z.array(z.object({ texto: z.string(), alt: z.string().nullable().optional(), requiere: z.string().optional() })),
    foto: z.string(),
    fotoAlt: z.string(),
    form: z.enum(['quick', 'quick-min', 'project']),
    formTitulo: z.string(),
    formServicio: z.string().optional(),
    cta: z.string(),
    beneficios: z.object({ titulo: z.string(), items: z.array(z.object({ icon: z.string(), titulo: z.string(), texto: z.string(), requiere: z.string().optional() })) }),
    proceso: z.enum(['servicio', 'proyecto']).default('servicio'),
    faq: z.array(faqItem),
    ctaFinal: z.object({ titulo: z.string(), texto: z.string() }),
  }),
});

const legales = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/legales' }),
  schema: z.object({ titulo: z.string(), descripcion: z.string(), actualizado: z.string() }),
});

// Páginas de servicio: SEO y hero tipados; el resto de bloques varía por página (passthrough).
const servicios = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/servicios' }),
  schema: z.object({
    seo: z.object({ title: z.string().max(60), description: z.string() }),
    hero: z.object({
      eyebrow: z.string().optional(),
      h1: z.string(),
      sub: z.string(),
      subAlt: z.string().optional(),
      foto: z.string(),
      fotoAlt: z.string(),
      disponibleHoy: z.boolean().default(false),
    }),
  }).passthrough(),
});

export const collections = { casos, landings, legales, servicios };
