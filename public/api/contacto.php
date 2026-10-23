<?php
/**
 * POST /api/contacto.php — recibe QuickForm y ProjectForm, valida, filtra spam y envía el lead por SMTP.
 * Respuestas JSON: 200 {ok:true} · 400 {ok:false,error} · 403 · 405 · 429 · 500.
 */
declare(strict_types=1);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception as MailException;

require __DIR__ . '/inc/lib.php';
require __DIR__ . '/vendor/phpmailer/Exception.php';
require __DIR__ . '/vendor/phpmailer/PHPMailer.php';
require __DIR__ . '/vendor/phpmailer/SMTP.php';

load_config();
cors();
date_default_timezone_set('America/Bogota');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: Content-Type, Accept');
    http_response_code(204);
    exit;
}
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    json_out(405, ['ok' => false, 'error' => 'method']);
}

// --- Entrada: JSON o multipart/form-data / urlencoded ---
$ctype = strtolower($_SERVER['CONTENT_TYPE'] ?? '');
if (str_starts_with($ctype, 'application/json')) {
    $raw = file_get_contents('php://input', false, null, 0, 20000);
    $in = json_decode((string) $raw, true);
    if (!is_array($in)) {
        json_out(400, ['ok' => false, 'error' => 'json']);
    }
} elseif (str_starts_with($ctype, 'multipart/form-data') || str_starts_with($ctype, 'application/x-www-form-urlencoded')) {
    $in = $_POST;
} else {
    json_out(400, ['ok' => false, 'error' => 'content_type']);
}
$get = fn(string $k, int $max = 200): string => clean(isset($in[$k]) && is_scalar($in[$k]) ? (string) $in[$k] : '', $max);

// --- Anti-spam 1: honeypot. Respuesta "ok" para no dar pistas al bot. ---
if ($get('empresa_web') !== '') {
    json_out(200, ['ok' => true]);
}

$ip = client_ip();

// --- Anti-spam 2: límite por IP ---
if (rate_limited($ip)) {
    json_out(429, ['ok' => false, 'error' => 'rate_limit']);
}

// --- Anti-spam 3: tiempo mínimo de llenado (token firmado) ---
if (!check_token($get('form_token', 120))) {
    json_out(400, ['ok' => false, 'error' => 'token']);
}

// --- Anti-spam 4: Cloudflare Turnstile ---
if (!turnstile_ok($get('cf-turnstile-response', 2048), $ip)) {
    json_out(400, ['ok' => false, 'error' => 'turnstile']);
}

// --- Validación (listas blancas iguales a src/config/servicios.ts) ---
const SERVICIOS = ['Reparación urgente', 'Mantenimiento', 'Instalación de aire acondicionado', 'Cuarto frío', 'Chiller', 'Otro'];
const PROYECTOS = ['Cuarto frío de conservación', 'Cuarto frío de congelación', 'Chiller', 'Climatización de edificio/planta', 'Contrato de mantenimiento'];
const FECHAS = ['Este mes', '1–3 meses', 'Más de 3 meses'];

$form = $get('form', 10) === 'project' ? 'project' : 'quick';
$errors = [];

$nombre = $get('nombre', 80);
if (mb_strlen($nombre) < 2) {
    $errors[] = 'nombre';
}
$telefono = clean_phone($get('telefono', 20));
if ($telefono === null) {
    $errors[] = 'telefono';
}
$email = $get('email', 120);
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'email';
}
if (!in_array($get('autorizacion', 5), ['1', 'true', 'on'], true)) {
    $errors[] = 'autorizacion';
}

$datos = ['Nombre' => $nombre, 'Celular' => $telefono ? '+57 ' . $telefono : ''];

if ($form === 'quick') {
    $servicio = $get('servicio', 60);
    if (!in_array($servicio, SERVICIOS, true)) {
        $errors[] = 'servicio';
    }
    $datos['Servicio'] = $servicio;
} else {
    $empresa = $get('empresa', 120);
    $ciudad = $get('ciudad', 80);
    $tipo = $get('tipo_proyecto', 60);
    $fecha = $get('fecha', 30);
    if ($empresa === '') {
        $errors[] = 'empresa';
    }
    if ($email === '') {
        $errors[] = 'email';
    }
    if ($ciudad === '') {
        $errors[] = 'ciudad';
    }
    if (!in_array($tipo, PROYECTOS, true)) {
        $errors[] = 'tipo_proyecto';
    }
    if (!in_array($fecha, FECHAS, true)) {
        $errors[] = 'fecha';
    }
    $servicio = $tipo;
    $datos += [
        'Empresa' => $empresa,
        'Cargo' => $get('cargo', 80),
        'Correo' => $email,
        'Ciudad' => $ciudad,
        'Tipo de proyecto' => $tipo,
        'Capacidad / medidas' => $get('capacidad', 160),
        'Fecha estimada' => $fecha,
        'Mensaje' => $get('mensaje', 2000),
    ];
}
if ($form === 'quick' && $email !== '') {
    $datos['Correo'] = $email;
}
if ($errors) {
    json_out(400, ['ok' => false, 'error' => 'validation', 'fields' => array_values(array_unique($errors))]);
}

$meta = [
    'Formulario' => $form === 'project' ? 'Proyecto de ingeniería' : 'Contacto rápido',
    'Página' => $get('pagina', 200),
    'Origen' => $get('servicio_origen', 60),
    'gclid' => $get('gclid', 200),
    'gbraid' => $get('gbraid', 200),
    'wbraid' => $get('wbraid', 200),
    'utm_source' => $get('utm_source', 100),
    'utm_medium' => $get('utm_medium', 100),
    'utm_campaign' => $get('utm_campaign', 150),
    'utm_term' => $get('utm_term', 150),
    'utm_content' => $get('utm_content', 150),
    'Fecha' => date('Y-m-d H:i') . ' (America/Bogota)',
];

// --- Correo al equipo ---
$asunto = '[Serviaires] Nuevo lead · ' . $servicio . ' · ' . $nombre;
$filas = '';
$texto = '';
foreach (array_merge($datos, ['—' => ''], $meta) as $k => $v) {
    if ($v === '' && $k !== '—') {
        continue;
    }
    if ($k === '—') {
        $filas .= '<tr><td colspan="2" style="padding:12px 0 4px;color:#666;font-size:13px">Atribución y contexto</td></tr>';
        $texto .= "\n— Atribución y contexto —\n";
        continue;
    }
    $filas .= '<tr><th align="left" style="padding:6px 12px 6px 0;color:#0047B9;vertical-align:top">' . h($k) . '</th><td style="padding:6px 0">' . nl2br(h($v)) . '</td></tr>';
    $texto .= $k . ': ' . $v . "\n";
}
$wa = 'https://wa.me/57' . $telefono;
$html = '<div style="font-family:Arial,sans-serif;font-size:15px;color:#222">'
    . '<h2 style="color:#0047B9;margin:0 0 12px">Nuevo lead desde la web</h2>'
    . '<p><a href="' . h($wa) . '">Responder por WhatsApp</a> · <a href="tel:+57' . h((string) $telefono) . '">Llamar</a></p>'
    . '<table cellspacing="0" cellpadding="0">' . $filas . '</table></div>';

function mailer(): PHPMailer
{
    $m = new PHPMailer(true);
    $m->isSMTP();
    $m->Host = SMTP_HOST;
    $m->Port = SMTP_PORT;
    $m->SMTPAuth = true;
    $m->Username = SMTP_USER;
    $m->Password = SMTP_PASS;
    $m->SMTPSecure = SMTP_PORT === 465 ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
    $m->CharSet = 'UTF-8';
    $m->setFrom(MAIL_FROM, MAIL_FROM_NAME);
    return $m;
}

try {
    $m = mailer();
    foreach (array_filter(array_map('trim', explode(',', MAIL_TO))) as $to) {
        $m->addAddress($to);
    }
    if ($email !== '') {
        $m->addReplyTo($email, $nombre);
    }
    $m->Subject = $asunto;
    $m->isHTML(true);
    $m->Body = $html;
    $m->AltBody = "Nuevo lead desde la web\n\n" . $texto;
    $m->send();
} catch (MailException $e) {
    error_log('[contacto] SMTP: ' . $e->getMessage());
    json_out(500, ['ok' => false, 'error' => 'mail']);
}

// --- Confirmación al usuario (si dejó correo) ---
if (SEND_CONFIRMATION && $email !== '') {
    try {
        $c = mailer();
        $c->addAddress($email, $nombre);
        $c->Subject = 'Recibimos tu solicitud · Serviaires';
        $c->isHTML(true);
        $c->Body = '<div style="font-family:Arial,sans-serif;font-size:15px;color:#222">'
            . '<p>Hola ' . h($nombre) . ',</p><p>Recibimos tu solicitud sobre <strong>' . h($servicio) . '</strong>. '
            . 'Te contactamos en horario hábil para coordinar los siguientes pasos.</p>'
            . '<p>Si es urgente, respóndenos por WhatsApp.</p><p>Equipo Serviaires</p></div>';
        $c->AltBody = "Hola $nombre,\n\nRecibimos tu solicitud sobre $servicio. Te contactamos en horario hábil.\n\nEquipo Serviaires";
        $c->send();
    } catch (MailException $e) {
        error_log('[contacto] confirmación: ' . $e->getMessage());
    }
}

// --- Webhook opcional (CRM / Google Sheets) ---
if (WEBHOOK_URL !== '') {
    $ch = curl_init(WEBHOOK_URL);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode(['form' => $form, 'datos' => $datos, 'meta' => $meta], JSON_UNESCAPED_UNICODE),
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 6,
    ]);
    curl_exec($ch);
    curl_close($ch);
}

json_out(200, ['ok' => true]);
