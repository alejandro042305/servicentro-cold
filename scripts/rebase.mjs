// Post-build SOLO para la vista previa en una subcarpeta (GitHub Pages: /serviaires-web/).
// Los enlaces del contenido son absolutos desde la raíz ("/servicios/…"); aquí se les antepone BASE_PATH.
// En Hostinger (raíz del dominio) BASE_PATH no se define y el script no hace nada.
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const base = (process.env.BASE_PATH || '/').replace(/\/?$/, '/');
if (base === '/') process.exit(0);

const dist = new URL('../dist/', import.meta.url).pathname.replace(/^\/(\w:)/, '$1');
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const re = /(\s(?:href|src|action|data-gmap)=")\/(?!\/)/g;
let n = 0;
for (const file of walk(dist).filter((f) => f.endsWith('.html'))) {
  const html = readFileSync(file, 'utf8');
  const out = html.replace(re, (m, attr, off) => {
    const rest = html.slice(off + m.length, off + m.length + base.length - 1);
    return rest === base.slice(1) ? m : `${attr}${base}`;
  });
  if (out !== html) { writeFileSync(file, out); n++; }
}
console.log(`rebase: ${n} archivos HTML ajustados a ${base}`);
