<?php
// ============================================================
// helpers/functions.php - Utilidades JWT y respuestas (Bolsa JB)
// ============================================================

require_once __DIR__ . '/../config/database.php';

$DOMINIOS_PERMITIDOS = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:4173',
    'https://bolsadetrabajo.consultoradeasesoriajb.com' // Futuro dominio de prod
];

function setCorsHeaders(): void
{
    global $DOMINIOS_PERMITIDOS;
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    if (in_array($origin, $DOMINIOS_PERMITIDOS, true)) {
        header("Access-Control-Allow-Origin: $origin");
        header("Access-Control-Allow-Credentials: true");
    } else {
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(403);
            exit();
        }
    }

    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    header("Access-Control-Max-Age: 86400");

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}

function setSecurityHeaders(): void
{
    header("X-Content-Type-Options: nosniff");
    header("X-Frame-Options: DENY");
    header("X-XSS-Protection: 1; mode=block");
    header("Referrer-Policy: strict-origin-when-cross-origin");
    header("Content-Type: application/json; charset=UTF-8");
}

function googleApiRequest(string $url): ?array
{
    $ch = curl_init();
 
    curl_setopt_array($ch, [
        CURLOPT_URL            => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_SSL_VERIFYPEER => true,  // Verificación SSL HABILITADA
        CURLOPT_SSL_VERIFYHOST => 2,     // Verificación SSL HABILITADA
        CURLOPT_CONNECTTIMEOUT => 5,     // Evita que la petición se quede colgada
        CURLOPT_TIMEOUT        => 8,
        CURLOPT_HTTPHEADER     => ['Accept: application/json'],
    ]);
 
    $response  = curl_exec($ch);
    $httpCode  = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);
 
    if ($response === false || $curlError) {
        error_log('googleApiRequest cURL error: ' . $curlError);
        return null;
    }
 
    if ($httpCode !== 200) {
        error_log('googleApiRequest HTTP ' . $httpCode . ': ' . $response);
        return null;
    }
 
    $data = json_decode($response, true);
 
    if (!is_array($data)) {
        error_log('googleApiRequest: respuesta no es JSON válido: ' . $response);
        return null;
    }
 
    return $data;
}

function respond(bool $success, $data = null, string $message = '', int $code = 200): void
{
    http_response_code($code);
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data,
    ]);
    exit;
}

function respondError(string $message, int $code = 400): void
{
    respond(false, null, $message, $code);
}

function jwtEncode(array $payload): string
{
    $header = base64url_encode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
    $payload['iat'] = time();
    $payload['exp'] = time() + JWT_EXPIRY;
    $pay = base64url_encode(json_encode($payload));
    $sig = base64url_encode(hash_hmac('sha256', "$header.$pay", JWT_SECRET, true));
    return "$header.$pay.$sig";
}

function jwtDecode(string $token): ?array
{
    $parts = explode('.', $token);
    if (count($parts) !== 3)
        return null;

    [$header, $payload, $sig] = $parts;
    $expected = base64url_encode(hash_hmac('sha256', "$header.$payload", JWT_SECRET, true));

    if (!hash_equals($expected, $sig))
        return null;

    $data = json_decode(base64url_decode($payload), true);
    if (!$data || $data['exp'] < time())
        return null;

    return $data;
}

function base64url_encode(string $data): string
{
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}
function base64url_decode(string $data): string
{
    return base64_decode(strtr($data, '-_', '+/') . str_repeat('=', 3 - (3 + strlen($data)) % 4));
}

function getBody(): array
{
    $raw = file_get_contents('php://input');
    $json = json_decode($raw, true);
    if (is_array($json)) {
        return $json;
    }
    // Fallback para FormData (multipart/form-data o application/x-www-form-urlencoded)
    if (!empty($_POST)) {
        return $_POST;
    }
    return [];
}

function generateUUID(): string
{
    $data = random_bytes(16);
    $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
    $data[8] = chr(ord($data[8]) & 0x3f | 0x80);
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}

function validarEmail(string $email): bool
{
    return (bool) filter_var($email, FILTER_VALIDATE_EMAIL)
        && preg_match('/\.[a-zA-Z]{2,}$/', explode('@', $email)[1] ?? '');
}

function validarPassword(string $pass): bool
{
    return strlen($pass) >= 8
        && preg_match('/[A-Z]/', $pass)
        && preg_match('/[0-9]/', $pass)
        && preg_match('/[^a-zA-Z0-9]/', $pass);
}

function sanitizarTexto(string $texto): string
{
    return htmlspecialchars(strip_tags(trim($texto)), ENT_QUOTES, 'UTF-8');
}

function raizEspanol(string $palabra): string
{
    $palabra = mb_strtolower(trim($palabra));
    $palabra = str_replace(
        ['á', 'é', 'í', 'ó', 'ú', 'ü', 'ñ'],
        ['a', 'e', 'i', 'o', 'u', 'u', 'n'],
        $palabra
    );

    $sufijos = [
        'mientos', 'miento', 'mienta',
        'ciones', 'ción', 'cional',
        'adores', 'ador', 'adora',
        'edores', 'edor', 'edora',
        'idores', 'idor', 'idora',
        'dores', 'dor', 'dora',
        'tivos', 'tivo', 'tiva',
        'antes', 'ante', 'entes', 'ente',
        'istas', 'ista',
        'ativos', 'ativo', 'ativa',
        'ivos', 'ivo', 'iva',
        'dad', 'dades', 'tud',
        'ario', 'aria', 'arios', 'arias',
        'ando', 'iendo',
        'ados', 'adas', 'ado', 'ada',
        'idos', 'idas', 'ido', 'ida',
        'ero', 'era', 'eros', 'eras',
        'tor', 'tora', 'sor', 'sora',
        'ar', 'er', 'ir',
        'os', 'as', 'o', 'a',
        'es', 's',
    ];

    foreach ($sufijos as $suf) {
        $l = strlen($suf);
        if (strlen($palabra) - $l >= 3 && substr($palabra, -$l) === $suf) {
            return substr($palabra, 0, -$l);
        }
    }

    return $palabra;
}
