<?php
// ============================================================
// api/users/index.php — Perfil y Seguridad del Usuario
// ============================================================

require_once __DIR__ . '/../../helpers/functions.php';
require_once __DIR__ . '/../../middleware/auth.php'; // ACTIVADO
require_once __DIR__ . '/../../helpers/mailer.php';

setCorsHeaders();
setSecurityHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
$db = getDB();

// 1. LISTAR USUARIOS (Solo Admin - Opcional para paneles)
if ($method === 'GET' && $action === 'listar') {
    requireAdmin(); // Protegemos esta ruta
    
    $stmt = $db->prepare("
        SELECT u.id, u.nombre_completo, u.correo, u.telefono, u.estado, r.nombre as rol_nombre
        FROM usuarios u INNER JOIN roles_sistema r ON u.rol_id = r.id
        ORDER BY u.fecha_registro DESC
    ");
    $stmt->execute();
    respond(true, $stmt->fetchAll());
}

// ─── SOLICITAR CÓDIGO SIN SESIÓN (olvidé mi contraseña) ──
if ($method === 'POST' && $action === 'forgot_password') {
    $body   = json_decode(file_get_contents('php://input'), true);
    $correo = trim($body['correo'] ?? '');

    if (!$correo) respondError('El correo es obligatorio.');
    if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) respondError('Correo no válido.');

    // Verificar que el usuario existe y está activo
    $stmt = $db->prepare("SELECT id FROM usuarios WHERE correo = ? AND estado = 'activo'");
    $stmt->execute([$correo]);
    $user = $stmt->fetch();

    // Por seguridad, siempre respondemos igual aunque no exista el correo
    // así no revelamos si un correo está registrado o no
    if ($user) {
        // Generar código de 6 dígitos
        $codigo  = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $expira  = date('Y-m-d H:i:s', strtotime('+15 minutes'));

        $stmt = $db->prepare("
            UPDATE usuarios
            SET codigo_recuperacion = ?,
                expiracion_codigo   = ?,
                ultimo_cambio_password = NULL
            WHERE id = ?
        ");
        $stmt->execute([$codigo, $expira, $user['id']]);

        // Enviar correo con el código
        require_once __DIR__ . '/../../templates/password_change_email.php';
        require_once __DIR__ . '/../../helpers/mailer.php';

        $asunto  = "Código de recuperación - Bolsa de Trabajo JB";
        $cuerpo  = getPasswordChangeEmailTemplate($codigo);
        enviarCorreo($correo, $asunto, $cuerpo);
    }

    respond(true, null, 'Si el correo existe, recibirás un código en tu bandeja de entrada.');
}

// ─── VERIFICAR CÓDIGO SIN SESIÓN (olvidé mi contraseña) ──
if ($method === 'POST' && $action === 'verify_forgot_password') {
    $body           = json_decode(file_get_contents('php://input'), true);
    $correo         = trim($body['correo']         ?? '');
    $codigo         = trim($body['codigo']         ?? '');
    $nueva_password = trim($body['nueva_password'] ?? '');

    if (!$correo || !$codigo || !$nueva_password) {
        respondError('Todos los campos son obligatorios.');
    }

    // Buscar usuario con ese correo y código válido
    $stmt = $db->prepare("
        SELECT id FROM usuarios
        WHERE correo = ?
          AND codigo_recuperacion = ?
          AND expiracion_codigo > NOW()
          AND estado = 'activo'
    ");
    $stmt->execute([$correo, $codigo]);
    $user = $stmt->fetch();

    if (!$user) respondError('Código incorrecto o expirado.');

    // Actualizar contraseña
    $hash = password_hash($nueva_password, PASSWORD_BCRYPT);
    $stmt = $db->prepare("
        UPDATE usuarios
        SET password               = ?,
            codigo_recuperacion    = NULL,
            expiracion_codigo      = NULL,
            ultimo_cambio_password = NOW()
        WHERE id = ?
    ");
    $stmt->execute([$hash, $user['id']]);

    respond(true, null, '¡Contraseña actualizada correctamente! Ya puedes iniciar sesión.');
}


// ─── DESDE AQUÍ, TODAS LAS RUTAS REQUIEREN QUE EL USUARIO ESTÉ LOGUEADO ───
$user = requireAuth();
$userId = $user['id'];

// OBTENER DATOS DEL PERFIL
if ($method === 'GET' && $action === 'get_profile') {
    $stmt = $db->prepare("
        SELECT nombre_completo, correo, telefono, texto_presentacion, cv_url
        FROM usuarios
        WHERE id = ?
    ");
    $stmt->execute([$userId]);
    $perfil = $stmt->fetch();

    if (!$perfil) respondError('Usuario no encontrado.', 404);

    respond(true, $perfil);
}

// 2. ACTUALIZAR PERFIL Y SUBIR CV
if ($method === 'POST' && $action === 'update_profile') {
    $nombre = $_POST['nombre_completo'] ?? null;
    $telefono = $_POST['telefono'] ?? null;
    $presentacion = $_POST['texto_presentacion'] ?? null;
    
    $fields = [];
    $params = [];

    if ($nombre) {
        $fields[] = 'nombre_completo = ?';
        $params[] = sanitizarTexto($nombre);
    }
    if ($telefono) {
        $fields[] = 'telefono = ?';
        $params[] = sanitizarTexto($telefono);
    }
    if ($presentacion !== null) {
        $fields[] = 'texto_presentacion = ?';
        $params[] = sanitizarTexto($presentacion);
    }

    // Procesar la subida del CV
    $newCvUrl = null;
    if (isset($_FILES['cv']) && $_FILES['cv']['error'] === UPLOAD_ERR_OK) {
        $fileTmpPath = $_FILES['cv']['tmp_name'];
        $fileName = $_FILES['cv']['name'];
        $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

        if ($fileExtension !== 'pdf') respondError('El CV debe ser un archivo PDF.');

        // Crear carpeta si no existe
        $uploadDir = __DIR__ . '/../../uploads/cvs/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

        // Nombre único para el archivo
        $newFileName = $userId . '_' . time() . '.pdf';
        $destPath = $uploadDir . $newFileName;

        if (move_uploaded_file($fileTmpPath, $destPath)) {
            $newCvUrl = 'uploads/cvs/' . $newFileName;
            $fields[] = 'cv_url = ?';
            $params[] = $newCvUrl;
        } else {
            respondError('Error interno al guardar el CV.');
        }
    }

    if (empty($fields)) respondError('No hay datos para actualizar.');

    $params[] = $userId;
    $stmt = $db->prepare("UPDATE usuarios SET " . implode(', ', $fields) . " WHERE id = ?");
    $stmt->execute($params);

    respond(true, ['cv_url' => $newCvUrl], 'Perfil actualizado correctamente.');
}

// 3. SOLICITAR CÓDIGO PARA CAMBIO DE CONTRASEÑA
if ($method === 'POST' && $action === 'request_password_change') {
    // Validar restricción de 3 días
    $stmt = $db->prepare("SELECT ultimo_cambio_password FROM usuarios WHERE id = ?");
    $stmt->execute([$userId]);
    $data = $stmt->fetch();

    if ($data['ultimo_cambio_password']) {
        $fechaUltimoCambio = new DateTime($data['ultimo_cambio_password']);
        $ahora = new DateTime();
        $diferencia = $ahora->diff($fechaUltimoCambio)->days;

        if ($diferencia < 3) {
            respondError("Por seguridad, solo puedes cambiar tu contraseña una vez cada 3 días. (Faltan " . (3 - $diferencia) . " días).");
        }
    }

    // Generar código de 6 dígitos
    $codigo = sprintf("%06d", mt_rand(1, 999999));
    $expiracion = date('Y-m-d H:i:s', strtotime('+15 minutes'));

    $stmt = $db->prepare("UPDATE usuarios SET codigo_recuperacion = ?, expiracion_codigo = ? WHERE id = ?");
    $stmt->execute([$codigo, $expiracion, $userId]);

    // Enviar correo usando el template
    require_once __DIR__ . '/../../templates/password_change_email.php';

    $asunto = "Código de seguridad - Cambio de contraseña";
    $cuerpoHTML = getPasswordChangeEmailTemplate($codigo);
    
    enviarCorreo($user['correo'], $asunto, $cuerpoHTML);

    respond(true, null, 'Se ha enviado un código de seguridad a tu correo.');
}

// 4. VERIFICAR CÓDIGO Y ACTUALIZAR CONTRASEÑA
if ($method === 'POST' && $action === 'verify_password_change') {
    $body = getBody();
    $codigoIngresado = $body['codigo'] ?? '';
    $nuevaPassword = $body['nueva_password'] ?? '';

    if (!$codigoIngresado || !$nuevaPassword) respondError('El código y la nueva contraseña son requeridos.');
    if (!validarPassword($nuevaPassword)) respondError('La nueva contraseña no cumple con los requisitos mínimos de seguridad.');

    // Verificar si el código coincide y no ha expirado
    $stmt = $db->prepare("SELECT codigo_recuperacion, expiracion_codigo FROM usuarios WHERE id = ?");
    $stmt->execute([$userId]);
    $data = $stmt->fetch();

    if ($data['codigo_recuperacion'] !== $codigoIngresado) respondError('El código de verificación es incorrecto.', 401);
    
    if (new DateTime() > new DateTime($data['expiracion_codigo'])) {
        // Limpiar código expirado
        $db->prepare("UPDATE usuarios SET codigo_recuperacion = NULL, expiracion_codigo = NULL WHERE id = ?")->execute([$userId]);
        respondError('El código ha expirado. Solicita uno nuevo.', 401);
    }

    // Actualizar contraseña y limpiar códigos
    $hash = password_hash($nuevaPassword, PASSWORD_BCRYPT, ['cost' => 12]);
    $ahora = date('Y-m-d H:i:s');

    $stmt = $db->prepare("
        UPDATE usuarios 
        SET password_hash = ?, 
            ultimo_cambio_password = ?, 
            codigo_recuperacion = NULL, 
            expiracion_codigo = NULL 
        WHERE id = ?
    ");
    $stmt->execute([$hash, $ahora, $userId]);

    respond(true, null, 'Tu contraseña ha sido actualizada con éxito.');
}

// 5. DARSE DE BAJA (ELIMINACIÓN LÓGICA)
if ($method === 'POST' && $action === 'delete_account') {
    $stmt = $db->prepare("UPDATE usuarios SET estado = 'inactivo' WHERE id = ?");
    $stmt->execute([$userId]);

    respond(true, null, 'Tu cuenta ha sido desactivada correctamente. Te extrañaremos.');
}

respondError('Endpoint o método no válido.', 404);