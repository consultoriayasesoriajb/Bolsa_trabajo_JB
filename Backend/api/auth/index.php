<?php
// ============================================================
// api/auth/index.php — Registro y Autenticación
// ============================================================

require_once __DIR__ . '/../../helpers/functions.php';
require_once __DIR__ . '/../../helpers/config.php';

setCorsHeaders();
setSecurityHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
$db = getDB();

if ($method === 'POST' && $action === 'register') {
    $body = getBody();

    $nombre_completo = sanitizarTexto($body['nombre_completo'] ?? '');
    $correo = strtolower(trim($body['correo'] ?? ''));
    $password = trim($body['password'] ?? '');
    $telefono = sanitizarTexto($body['telefono'] ?? '');

    if (!$nombre_completo || !$correo || !$password)
        respondError('Todos los campos principales son obligatorios.');
    if (!validarEmail($correo))
        respondError('Formato de correo inválido.');
    if (!validarPassword($password))
        respondError('La contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un símbolo.');

    $stmt = $db->prepare("SELECT id FROM usuarios WHERE correo = ?");
    $stmt->execute([$correo]);
    if ($stmt->fetch())
        respondError('Este correo ya está registrado.');

    // Asignar rol 'usuario' por defecto
    $stmtRol = $db->prepare("SELECT id FROM roles_sistema WHERE nombre = 'usuario'");
    $stmtRol->execute();
    $rol = $stmtRol->fetch();

    $id = generateUUID();
    $hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
    $fecha_registro = date('Y-m-d H:i:s');

    $stmt = $db->prepare("
        INSERT INTO usuarios (id, rol_id, nombre_completo, correo, password_hash, telefono, estado, correo_verificado, fecha_registro)
        VALUES (?, ?, ?, ?, ?, ?, 'activo', 0, ?)
    ");
    $stmt->execute([$id, $rol['id'], $nombre_completo, $correo, $hash, $telefono, $fecha_registro]);
    require_once __DIR__ . '/../../templates/welcome_email.php';
    require_once __DIR__ . '/../../helpers/mailer.php';

    // 1. Generamos un token especial que contiene el ID del usuario
    $tokenVerificacion = jwtEncode(['verify_id' => $id]);
    
    // 2. Creamos la URL apuntando temporalmente directo al backend
    // Nota: Ajusta 'backend-bolsajb' si el nombre de tu carpeta en htdocs es distinto
    $urlVerificacion = "http://localhost/backend-bolsajb/api/auth/?action=verify_email&token=" . $tokenVerificacion;

    $asunto = "¡Valida tu cuenta en Bolsa de Trabajo JB!";
    $cuerpoHTML = getWelcomeEmailTemplate($nombre_completo, $urlVerificacion);
    
    $estadoCorreo = enviarCorreo($correo, $asunto, $cuerpoHTML);
    // -----------------------------------------------------------

    respond(true, [
        'id' => $id, 
        'correo' => $correo,
        'debug_correo' => $estadoCorreo === true ? 'Enviado correctamente' : $estadoCorreo
    ], 'Cuenta creada exitosamente.', 201);
}

if ($method === 'POST' && $action === 'login') {
    $body = getBody();
    $correo = strtolower(trim($body['correo'] ?? ''));
    $password = trim($body['password'] ?? '');

    if (!$correo || !$password)
        respondError('Correo y contraseña requeridos.');

    $stmt = $db->prepare("
        SELECT u.id, u.nombre_completo, u.correo, u.telefono, u.estado, u.cv_url, u.password_hash, r.nombre as rol_nombre 
        FROM usuarios u
        INNER JOIN roles_sistema r ON u.rol_id = r.id
        WHERE u.correo = ?
    ");
    $stmt->execute([$correo]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash']))
        respondError('Credenciales incorrectas.', 401);
    if ($user['estado'] === 'inactivo')
        respondError('Esta cuenta ha sido desactivada.', 403);

    $token = jwtEncode([
        'id' => $user['id'],
        'role' => $user['rol_nombre']
    ]);

    unset($user['password_hash']); // No devolver el hash al frontend

    respond(true, ['user' => $user, 'token' => $token], 'Inicio de sesión exitoso.');
}

// ─── VALIDACIÓN DE CORREO (GET) ───────────────────────────────
if ($method === 'GET' && $action === 'verify_email') {
    $token = $_GET['token'] ?? '';
    
    // URL base de tu frontend en React (Ajusta el puerto si tu Vite usa otro)
    $frontendUrl = "http://localhost:5173/cuenta-validada";

    // 1. Si no hay token, redirigir con error genérico
    if (!$token) {
        header("Location: $frontendUrl?status=error");
        exit;
    }

    // 2. Decodificar el token para sacar el ID del usuario
    $payload = jwtDecode($token);
    
    // 3. Si el token es inválido, fue alterado o expiró
    if (!$payload || !isset($payload['verify_id'])) {
        header("Location: $frontendUrl?status=expired");
        exit;
    }

    $userId = $payload['verify_id'];

    // 4. Actualizar el estado en la base de datos (se mantiene la seguridad PDO)
    $stmt = $db->prepare("UPDATE usuarios SET correo_verificado = 1 WHERE id = ?");
    $stmt->execute([$userId]);

    // 5. Redirigir a la interfaz amigable de React con éxito
    header("Location: $frontendUrl?status=success");
    exit;
}

// ─── LOGIN / REGISTRO CON GOOGLE (POST) ────────────────────────
if ($method === 'POST' && $action === 'google_login') {
    $body = getBody();
    $idToken = $body['credential'] ?? ''; // Viene de <GoogleLogin /> -> credentialResponse.credential (JWT)
 
    if (!$idToken) {
        respondError('Token de Google no proporcionado.');
    }
 
    // ── 1. Verificar el ID token (JWT) con Google ─────────────────────────
    // tokeninfo valida: firma, expiración, y nos devuelve el payload (incluye 'aud').
    $tokenInfo = googleApiRequest(
        'https://oauth2.googleapis.com/tokeninfo?id_token=' . urlencode($idToken)
    );
 
    if ($tokenInfo === null || isset($tokenInfo['error'])) {
        respondError('El token de Google es inválido o ha expirado.', 401);
    }
 
    // ── 2. Validar que el token fue emitido para ESTA aplicación ──────────
    // Con un id_token, 'aud' siempre viene incluido y es el Client ID exacto.
    if (($tokenInfo['aud'] ?? null) !== GOOGLE_CLIENT_ID) {
        // El token es válido, pero fue emitido para OTRA aplicación. Posible intento de suplantación.
        respondError('El token de Google no corresponde a esta aplicación.', 401);
    }
 
    // ── 3. Validar que el emisor sea realmente Google ──────────────────────
    $issuerValido = in_array($tokenInfo['iss'] ?? '', ['accounts.google.com', 'https://accounts.google.com'], true);
    if (!$issuerValido) {
        respondError('El token de Google no es válido.', 401);
    }
 
    // ── 4. Validar que el correo esté verificado por Google ────────────────
    if (empty($tokenInfo['email']) || ($tokenInfo['email_verified'] ?? 'false') === 'false') {
        respondError('Tu cuenta de Google no tiene el correo verificado.', 401);
    }
 
    $correo = strtolower(trim($tokenInfo['email']));
    $nombre = sanitizarTexto($tokenInfo['name'] ?? $correo);
    $googleId = $tokenInfo['sub'] ?? null;
 
    if (!$googleId) {
        respondError('No se pudo identificar la cuenta de Google.', 401);
    }
 
    // ── 5. Buscar si el usuario ya existe ──────────────────────────────────
    $stmt = $db->prepare("
        SELECT u.id, u.nombre_completo, u.correo, u.telefono, u.estado, u.cv_url, r.nombre as rol_nombre 
        FROM usuarios u
        INNER JOIN roles_sistema r ON u.rol_id = r.id
        WHERE u.correo = ?
    ");
    $stmt->execute([$correo]);
    $user = $stmt->fetch();
 
    // ── 6. Si no existe, creamos la cuenta automáticamente ────────────────
    if (!$user) {
        $stmtRol = $db->prepare("SELECT id FROM roles_sistema WHERE nombre = 'usuario'");
        $stmtRol->execute();
        $rol = $stmtRol->fetch();
 
        $id = generateUUID();
        $fecha_registro = date('Y-m-d H:i:s');
 
        $stmtInsert = $db->prepare("
            INSERT INTO usuarios (id, rol_id, google_id, nombre_completo, correo, estado, correo_verificado, fecha_registro)
            VALUES (?, ?, ?, ?, ?, 'activo', 1, ?)
        ");
        $stmtInsert->execute([$id, $rol['id'], $googleId, $nombre, $correo, $fecha_registro]);
 
        $user = [
            'id' => $id,
            'nombre_completo' => $nombre,
            'correo' => $correo,
            'estado' => 'activo',
            'rol_nombre' => 'usuario',
        ];
    } else {
        if ($user['estado'] === 'inactivo') {
            respondError('Esta cuenta ha sido desactivada.', 403);
        }
        // Vinculamos el google_id solo si la cuenta no tenía uno (se registró antes con correo/clave)
        $stmtUpdate = $db->prepare("
            UPDATE usuarios 
            SET google_id = ?, correo_verificado = 1 
            WHERE correo = ? AND google_id IS NULL
        ");
        $stmtUpdate->execute([$googleId, $correo]);
    }
 
    $token = jwtEncode(['id' => $user['id'], 'role' => $user['rol_nombre']]);
    respond(true, ['user' => $user, 'token' => $token], 'Autenticación con Google exitosa.');
}

respondError('Acción no válida.', 404);