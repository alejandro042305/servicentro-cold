// Verifica el contraste WCAG de las combinaciones de color usadas en el sitio.
// Lee los valores reales de src/styles/tokens.css. Falla (exit 1) si texto normal < 4,5:1
// o texto grande / iconos < 3:1. Se ejecuta en `npm run build` (prebuild).
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../src/styles/tokens.css', import.meta.url), 'utf8');
const tokens = {};
for (const m of css.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})\b/g)) tokens[m[1]] = m[2];

const hex = (v) => (v.startsWith('#') ? v : tokens[v]);
const lum = (h) => {
  const c = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => {
  const [x, y] = [lum(hex(a)), lum(hex(b))];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};

// [texto, fondo, tipo, dónde]   tipo: 'normal' (4,5) | 'grande' (3) | 'icono' (3)
const PARES = [
  ['#FFFFFF', 'c-primary-600', 'normal', 'Botón primario, texto de tarjetas azules'],
  ['c-on-primary-soft', 'c-primary-600', 'grande', 'H3 #F9F9F9 en tarjetas azules (24 px)'],
  ['#FFFFFF', 'c-primary-500', 'normal', 'Texto en secciones azules (contacto, urgencias)'],
  ['c-on-primary-soft', 'c-primary-500', 'grande', 'H2 sobre sección azul'],
  ['#FFFFFF', 'c-primary-900', 'normal', 'Footer, hero interno, TopBar'],
  ['c-primary-800', '#FFFFFF', 'normal', 'Texto de botón blanco, H1 de la home'],
  ['c-primary-800', 'c-bg-soft', 'normal', 'H1 sobre dot-grid'],
  ['c-text', 'c-bg', 'normal', 'Párrafos'],
  ['c-text', 'c-bg-soft', 'normal', 'Párrafos sobre #F9F9F9'],
  ['c-text-muted', 'c-bg-muted', 'normal', 'Pregunta FAQ cerrada'],
  ['c-text-muted', 'c-bg', 'normal', 'Texto secundario'],
  ['c-link', 'c-bg', 'normal', 'Enlaces'],
  ['c-link', 'c-bg-soft', 'normal', 'Enlaces sobre #F9F9F9'],
  ['c-primary-900', 'c-bg-soft', 'normal', 'Cifras, eyebrow, chips'],
  ['#FFFFFF', 'c-urgent', 'normal', 'Botón de urgencias'],
  ['#FFFFFF', 'c-whatsapp-btn', 'normal', 'Botón WhatsApp con texto'],
  ['#FFFFFF', 'c-phone-btn', 'normal', 'Botón Llamar (barra móvil)'],
  ['#FFFFFF', 'c-accent', 'normal', 'Ítem de submenú en hover'],
  ['#FFFFFF', 'c-ink', 'normal', 'StatsBand'],
  ['#FFFFFF', 'c-phone', 'icono', 'Icono en burbuja de teléfono'],
  ['c-primary-600', 'c-bg', 'icono', 'Iconos azules / borde de inputs en foco'],
  ['c-error', 'c-bg', 'normal', 'Mensajes de error'],
];
const MIN = { normal: 4.5, grande: 3, icono: 3 };

let fallos = 0;
for (const [fg, bg, tipo, donde] of PARES) {
  if (!hex(fg) || !hex(bg)) { console.error(`✗ Token no encontrado: ${fg} / ${bg}`); fallos++; continue; }
  const r = ratio(fg, bg);
  const ok = r >= MIN[tipo];
  if (!ok) fallos++;
  console.log(`${ok ? '✓' : '✗'} ${r.toFixed(2)}:1 (${tipo} ≥ ${MIN[tipo]}) ${hex(fg)} sobre ${hex(bg)} · ${donde}`);
}
if (fallos) {
  console.error(`\n${fallos} combinación(es) sin contraste suficiente. Corrige src/styles/tokens.css.`);
  process.exit(1);
}
console.log('\nContraste OK.');
