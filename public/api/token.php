<?php
/**
 * GET /api/token.php → { "token": "<timestamp>.<hmac>" }
 * El formulario lo pide al primer foco; contacto.php exige que tenga al menos MIN_FILL_SECONDS de antigüedad.
 */
declare(strict_types=1);
require __DIR__ . '/inc/lib.php';
load_config();
cors();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
    header('Allow: GET');
    json_out(405, ['ok' => false, 'error' => 'method']);
}
json_out(200, ['token' => sign_token(time())]);
