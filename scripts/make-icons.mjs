// Genera favicon.svg/png, apple-touch-icon y og/og-default.jpg PROVISIONALES (sin logo real del cliente).
// Cuando llegue el logo (_insumos/logo.svg + favicon.png), reemplaza estos archivos en public/. Ver PENDIENTES.md.
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';

const pub = new URL('../public/', import.meta.url);
mkdirSync(new URL('og/', pub), { recursive: true });

const flake = (s = 1) => `<g transform="scale(${s})" stroke="#FFF" stroke-width="6" fill="none" stroke-linecap="round">
  <path d="M50 10v80M15 30l70 40M15 70l70-40"/><path d="M41 17l9 9 9-9M41 83l9-9 9 9M18 41l12-3-3-12M82 59l-12 3 3 12M18 59l12 3-3 12M82 41l-12-3 3-12"/></g>`;

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="24" fill="#0774E2"/>${flake()}</svg>`;
writeFileSync(new URL('favicon.svg', pub), favicon);
await sharp(Buffer.from(favicon)).resize(512, 512).png().toFile(new URL('favicon.png', pub).pathname.replace(/^\/(\w:)/, '$1'));
await sharp(Buffer.from(favicon.replace('rx="24"', 'rx="0"'))).resize(180, 180).png().toFile(new URL('apple-touch-icon.png', pub).pathname.replace(/^\/(\w:)/, '$1'));

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#0047B9"/>
  <g fill="rgba(255,255,255,.06)">${Array.from({ length: 32 }, (_, y) => Array.from({ length: 60 }, (_, x) => `<circle cx="${x * 20 + 10}" cy="${y * 20 + 10}" r="1.6"/>`).join('')).join('')}</g>
  <g transform="translate(860 150) scale(3.3)" opacity=".18">${flake()}</g>
  <rect x="80" y="110" width="96" height="96" rx="24" fill="#0774E2"/><g transform="translate(80 110) scale(.96)">${flake()}</g>
  <text x="200" y="178" font-family="Poppins, Arial, sans-serif" font-weight="600" font-size="56" fill="#FFF" letter-spacing="-1">Serviaires</text>
  <text x="80" y="330" font-family="Poppins, Arial, sans-serif" font-weight="600" font-size="58" fill="#FFF" letter-spacing="-1">Aire acondicionado, cuartos fríos</text>
  <text x="80" y="400" font-family="Poppins, Arial, sans-serif" font-weight="600" font-size="58" fill="#FFF" letter-spacing="-1">y chillers en Bogotá</text>
  <text x="80" y="480" font-family="Arial, sans-serif" font-size="30" fill="#FFF">Reparación · Instalación · Mantenimiento · Ingeniería</text>
</svg>`;
await sharp(Buffer.from(og)).jpeg({ quality: 82, mozjpeg: true }).toFile(new URL('og/og-default.jpg', pub).pathname.replace(/^\/(\w:)/, '$1'));
console.log('Iconos y OG generados.');
