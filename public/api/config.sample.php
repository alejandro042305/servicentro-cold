<?php
/**
 * Servicentro Cold · Configuración del formulario (EJEMPLO).
 *
 * 1. Copia este archivo como `config.php` en la misma carpeta (public_html/api/config.php en Hostinger).
 * 2. Rellena los valores reales. `config.php` NO va a git y está bloqueado por .htaccess.
 */

// --- SMTP de Hostinger (hPanel → Correos) ---
const SMTP_HOST = 'smtp.hostinger.com';
const SMTP_PORT = 465;                       // SSL
const SMTP_USER = 'no-reply@tudominio.com';  // buzón creado en hPanel
const SMTP_PASS = 'CAMBIAR';

// --- Remitente y destino ---
const MAIL_FROM      = 'no-reply@tudominio.com';
const MAIL_FROM_NAME = 'Web Servicentro Cold';
const MAIL_TO        = 'comercial@tudominio.com';   // quien recibe los leads (se pueden separar con coma)
const SEND_CONFIRMATION = true;                     // copia de confirmación al usuario si dejó correo

// --- Seguridad ---
// Secreto largo y aleatorio para firmar el token de tiempo mínimo (ej.: `openssl rand -hex 32`).
const HMAC_SECRET = 'CAMBIAR_POR_UN_SECRETO_LARGO_Y_ALEATORIO';
// Cloudflare Turnstile (dash.cloudflare.com → Turnstile). Vacío = no se verifica (no recomendado en producción).
const TURNSTILE_SECRET = '';
// Dominio propio para CORS (sin barra final).
const ALLOWED_ORIGIN = 'https://tudominio.com';

// --- Límites ---
const RATE_LIMIT_MAX = 5;           // envíos por IP…
const RATE_LIMIT_WINDOW = 600;      // …cada 10 minutos
const MIN_FILL_SECONDS = 3;         // tiempo mínimo de llenado
const TOKEN_MAX_AGE = 7200;         // el token vale 2 horas

// --- Opcional: reenviar el lead en JSON (Google Sheets vía Apps Script, CRM…) ---
const WEBHOOK_URL = '';
