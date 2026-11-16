<?php
/**
 * Servicentro Cold · utilidades del formulario. Carpeta bloqueada por .htaccess (no accesible desde la web).
 */
declare(strict_types=1);

function load_config(): void
{
    $cfg = __DIR__ . '/../config.php';
    if (!is_file($cfg)) {
        json_out(500, ['ok' => false, 'error' => 'config_missing']);
    }
    require_once $cfg;
}

function json_out(int $status, array $data): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

/** CORS: solo el dominio propio. Peticiones del mismo origen no envían Origin en GET; en POST sí. */
function cors(): void
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin === '') {
        return;
    }
    $allowed = rtrim(ALLOWED_ORIGIN, '/');
    $alt = preg_replace('#^https://(www\.)?#', 'https://www.', $allowed);
    if ($origin !== $allowed && $origin !== $alt && $origin !== str_replace('https://www.', 'https://', $allowed)) {
        json_out(403, ['ok' => false, 'error' => 'origin']);
    }
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
}

function client_ip(): string
{
    // Hostinger puede ir detrás de su proxy/CDN; usamos REMOTE_ADDR salvo cabecera de Cloudflare.
    $ip = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    return filter_var($ip, FILTER_VALIDATE_IP) ? $ip : '0.0.0.0';
}

/** Token de tiempo mínimo: "<timestamp>.<hmac>" */
function sign_token(int $ts): string
{
    return $ts . '.' . hash_hmac('sha256', (string) $ts, HMAC_SECRET);
}

function check_token(string $token): bool
{
    if (!preg_match('/^(\d{10})\.([a-f0-9]{64})$/', $token, $m)) {
        return false;
    }
    $ts = (int) $m[1];
    if (!hash_equals(hash_hmac('sha256', (string) $ts, HMAC_SECRET), $m[2])) {
        return false;
    }
    $age = time() - $ts;
    return $age >= MIN_FILL_SECONDS && $age <= TOKEN_MAX_AGE;
}

/** Límite de envíos por IP: archivo JSON en api/.ratelimit/ (bloqueado por .htaccess). */
function rate_limited(string $ip): bool
{
    $dir = __DIR__ . '/../.ratelimit';
    if (!is_dir($dir)) {
        @mkdir($dir, 0700, true);
    }
    $file = $dir . '/' . hash('sha256', $ip . HMAC_SECRET) . '.json';
    $now = time();
    $hits = [];
    if (is_file($file)) {
        $hits = json_decode((string) file_get_contents($file), true) ?: [];
    }
    $hits = array_values(array_filter($hits, fn($t) => is_int($t) && $t > $now - RATE_LIMIT_WINDOW));
    if (count($hits) >= RATE_LIMIT_MAX) {
        return true;
    }
    $hits[] = $now;
    file_put_contents($file, json_encode($hits), LOCK_EX);
    // Limpieza ocasional de archivos viejos
    if (random_int(1, 50) === 1) {
        foreach (glob($dir . '/*.json') ?: [] as $f) {
            if (filemtime($f) < $now - 86400) {
                @unlink($f);
            }
        }
    }
    return false;
}

function turnstile_ok(string $response, string $ip): bool
{
    if (TURNSTILE_SECRET === '') {
        return true; // no configurado (ver PENDIENTES.md)
    }
    if ($response === '') {
        return false;
    }
    $ch = curl_init('https://challenges.cloudflare.com/turnstile/v0/siteverify');
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => http_build_query(['secret' => TURNSTILE_SECRET, 'response' => $response, 'remoteip' => $ip]),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 8,
    ]);
    $res = curl_exec($ch);
    curl_close($ch);
    $json = is_string($res) ? json_decode($res, true) : null;
    return is_array($json) && !empty($json['success']);
}

/** Texto limpio: sin etiquetas, sin caracteres de control, espacios normalizados y longitud máxima. */
function clean(?string $v, int $max = 200): string
{
    $v = strip_tags((string) $v);
    $v = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $v) ?? '';
    $v = trim(preg_replace('/[ \t]+/u', ' ', $v) ?? '');
    return mb_substr($v, 0, $max);
}

/** Celular colombiano: 10 dígitos que empiezan por 3 (acepta +57/57 delante). */
function clean_phone(string $v): ?string
{
    $d = preg_replace('/\D/', '', $v) ?? '';
    if (strlen($d) === 12 && str_starts_with($d, '57')) {
        $d = substr($d, 2);
    }
    return preg_match('/^3\d{9}$/', $d) ? $d : null;
}

function h(string $v): string
{
    return htmlspecialchars($v, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}
