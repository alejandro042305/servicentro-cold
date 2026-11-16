// Prepara los archivos de marca a partir de _insumos/logo-original.png (logo Servicentro Cold con fondo blanco):
//   src/assets/logo/logo.png         → logo a color con fondo transparente (header)
//   src/assets/logo/logo-blanco.png  → mismo logo todo en blanco (footer y fondos azules)
//   public/favicon.png · favicon.svg · apple-touch-icon.png → ícono (copo + C)
//   public/og/og-default.jpg         → imagen para compartir en redes (1200×630)
// Uso: node scripts/prepare-logo.mjs  (volver a ejecutar si cambia el logo)
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';

const root = new URL('../', import.meta.url).pathname.replace(/^\/(\w:)/, '$1');
const SRC = `${root}_insumos/logo-original.png`;
mkdirSync(`${root}src/assets/logo`, { recursive: true });
mkdirSync(`${root}public/og`, { recursive: true });

// "Color a alfa": el blanco del fondo pasa a transparente y los bordes suavizados conservan su color real.
async function toAlpha(input, { white = false } = {}) {
  const { data, info } = await sharp(input).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    let a = Math.max(255 - r, 255 - g, 255 - b) / 255;
    if (a < 0.08) a = 0; // ruido del fondo (#F8F8F8)
    const un = (c) => (a ? Math.round(Math.min(255, Math.max(0, (c - 255 * (1 - a)) / a))) : 0);
    out[j] = white ? 255 : un(r);
    out[j + 1] = white ? 255 : un(g);
    out[j + 2] = white ? 255 : un(b);
    out[j + 3] = Math.round(a * 255);
  }
  return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } });
}

const color = await (await toAlpha(SRC)).png().toBuffer();
const colorTrim = await sharp(color).trim({ threshold: 1 }).png({ compressionLevel: 9 }).toBuffer();
await sharp(colorTrim).toFile(`${root}src/assets/logo/logo.png`);
const white = await (await toAlpha(SRC, { white: true })).png().toBuffer();
await sharp(white).trim({ threshold: 1 }).png({ compressionLevel: 9 }).toFile(`${root}src/assets/logo/logo-blanco.png`);

// Ícono: zona izquierda del logo (copo de nieve + C), antes de la línea vertical y por encima del lema.
const meta = await sharp(SRC).metadata();
const icon = await sharp(color)
  .extract({ left: 0, top: 0, width: Math.round(meta.width * 0.355), height: Math.round(meta.height * 0.79) })
  .png().toBuffer();
const iconTrim = await sharp(icon).trim({ threshold: 1 }).png().toBuffer();
const square = async (size, bg, pad) => {
  const inner = Math.round(size * (1 - pad * 2));
  const fitted = await sharp(iconTrim).resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: bg } }).composite([{ input: fitted, gravity: 'center' }]).png();
};
await (await square(512, { r: 0, g: 0, b: 0, alpha: 0 }, 0.04)).toFile(`${root}public/favicon.png`);
await (await square(180, { r: 255, g: 255, b: 255, alpha: 1 }, 0.1)).toFile(`${root}public/apple-touch-icon.png`);
const fav64 = (await (await square(64, { r: 0, g: 0, b: 0, alpha: 0 }, 0.02)).toBuffer()).toString('base64');
writeFileSync(`${root}public/favicon.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><image width="64" height="64" href="data:image/png;base64,${fav64}"/></svg>\n`);

// Imagen OG: logo a color sobre blanco + franja azul con el mensaje.
const logoOg = await sharp(colorTrim).resize({ width: 920 }).png().toBuffer();
const lm = await sharp(logoOg).metadata();
const band = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="150">
  <rect width="1200" height="150" fill="#0047B9"/>
  <text x="600" y="68" text-anchor="middle" font-family="Poppins, Arial, sans-serif" font-weight="600" font-size="40" fill="#FFF">Aire acondicionado, cuartos fríos y chillers</text>
  <text x="600" y="116" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="#FFF">Bogotá · Reparación · Instalación · Mantenimiento</text>
</svg>`);
await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#FFFFFF' } })
  .composite([
    { input: logoOg, top: Math.round((480 - lm.height) / 2), left: Math.round((1200 - lm.width) / 2) },
    { input: band, top: 480, left: 0 },
  ])
  .jpeg({ quality: 85, mozjpeg: true })
  .toFile(`${root}public/og/og-default.jpg`);

const m1 = await sharp(`${root}src/assets/logo/logo.png`).metadata();
console.log(`logo.png ${m1.width}×${m1.height} · favicon, apple-touch-icon y OG generados.`);
