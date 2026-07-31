<?php
require_once __DIR__ . '/../../helpers/functions.php';
require_once __DIR__ . '/../../middleware/auth.php';

setCorsHeaders();
setSecurityHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
$db = getDB();

// ─── LISTAR EMPRESAS CON PROMEDIO ────────────────────────
if ($method === 'GET' && $action === 'empresas') {
    $busqueda = $_GET['busqueda'] ?? '';

    $where = "1=1";
    $params = [];

    if ($busqueda) {
        $where .= " AND (e.nombre LIKE ? OR e.sector LIKE ?)";
        $params[] = '%' . $busqueda . '%';
        $params[] = '%' . $busqueda . '%';
    }

    $stmt = $db->prepare("
        SELECT 
            e.id, e.nombre, e.sector, e.logo_url,
            e.descripcion, e.anio_fundacion, e.num_empleados,
            e.sitio_web, e.ubicacion, e.beneficios, e.ruc,
            ROUND(AVG(ev.estrellas), 1) AS promedio,
            COUNT(ev.id)               AS total_evaluaciones
        FROM empresas_clientes e
        LEFT JOIN evaluaciones ev ON ev.empresa_id = e.id AND ev.estado = 'visible'
        WHERE $where
        GROUP BY e.id
        ORDER BY e.nombre ASC
    ");
    $stmt->execute($params);
    respond(true, $stmt->fetchAll());
}

// ─── DETALLE DE EMPRESA CON EVALUACIONES ─────────────────
if ($method === 'GET' && $action === 'detalle') {
    $empresa_id = $_GET['empresa_id'] ?? null;
    if (!$empresa_id) respondError('ID de empresa requerido.');

    $stmt = $db->prepare("
        SELECT 
            e.id, e.nombre, e.sector, e.logo_url,
            e.descripcion, e.anio_fundacion, e.num_empleados,
            e.sitio_web, e.ubicacion, e.beneficios, e.ruc,
            ROUND(AVG(ev.estrellas), 1) AS promedio,
            COUNT(ev.id)               AS total_evaluaciones
        FROM empresas_clientes e
        LEFT JOIN evaluaciones ev ON ev.empresa_id = e.id AND ev.estado = 'visible'
        WHERE e.id = ?
        GROUP BY e.id
    ");
    $stmt->execute([$empresa_id]);
    $empresa = $stmt->fetch();
    if (!$empresa) respondError('Empresa no encontrada.', 404);

    // Parsear beneficios JSON
    if ($empresa['beneficios']) {
        $empresa['beneficios'] = json_decode($empresa['beneficios'], true);
    }

    // Traer evaluaciones visibles
    $stmtEv = $db->prepare("
        SELECT 
            ev.id, ev.relacion, ev.tiempo_relacion,
            ev.estrellas, ev.texto_positivo, ev.texto_negativo,
            ev.recomendaria, ev.fecha_creacion,
            CONCAT(
                UPPER(LEFT(u.nombre_completo, 1)),
                '.',
                UPPER(LEFT(SUBSTRING_INDEX(u.nombre_completo, ' ', -1), 1)),
                '.'
            ) AS iniciales
        FROM evaluaciones ev
        JOIN usuarios u ON ev.usuario_id = u.id
        WHERE ev.empresa_id = ? AND ev.estado = 'visible'
        ORDER BY ev.fecha_creacion DESC
    ");
    $stmtEv->execute([$empresa_id]);
    $empresa['evaluaciones'] = $stmtEv->fetchAll();

    respond(true, $empresa);
}

// ─── VERIFICAR SI YA EVALUÓ ──────────────────────────────
if ($method === 'GET' && $action === 'ya_evaluo') {
    $user = requireAuth();
    $empresa_id = $_GET['empresa_id'] ?? null;
    if (!$empresa_id) respondError('ID de empresa requerido.');

    $stmt = $db->prepare("
        SELECT id FROM evaluaciones 
        WHERE usuario_id = ? AND empresa_id = ?
    ");
    $stmt->execute([$user['id'], $empresa_id]);
    respond(true, ['ya_evaluo' => (bool)$stmt->fetch()]);
}

// ─── CREAR EVALUACIÓN ────────────────────────────────────
if ($method === 'POST' && $action === 'crear') {
    $user = requireAuth();
    $body = json_decode(file_get_contents('php://input'), true);

    $empresa_id     = $body['empresa_id']     ?? null;
    $relacion       = $body['relacion']       ?? null;
    $tiempo_relacion = $body['tiempo_relacion'] ?? null;
    $estrellas      = $body['estrellas']      ?? null;
    $texto_positivo = $body['texto_positivo'] ?? null;
    $texto_negativo = $body['texto_negativo'] ?? null;
    $recomendaria   = $body['recomendaria']   ?? null;

    if (!$empresa_id || !$relacion || !$tiempo_relacion || !$estrellas || !$recomendaria) {
        respondError('Faltan campos obligatorios.');
    }

    if ($estrellas < 1 || $estrellas > 5) {
        respondError('Las estrellas deben estar entre 1 y 5.');
    }

    // Verificar que no haya evaluado antes
    $stmt = $db->prepare("SELECT id FROM evaluaciones WHERE usuario_id = ? AND empresa_id = ?");
    $stmt->execute([$user['id'], $empresa_id]);
    if ($stmt->fetch()) respondError('Ya has evaluado esta empresa.');

    $stmt = $db->prepare("
        INSERT INTO evaluaciones 
            (usuario_id, empresa_id, relacion, tiempo_relacion, estrellas, texto_positivo, texto_negativo, recomendaria)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([
        $user['id'], $empresa_id, $relacion, $tiempo_relacion,
        $estrellas, $texto_positivo, $texto_negativo, $recomendaria
    ]);

    respond(true, null, 'Evaluación enviada correctamente. ¡Gracias por tu opinión!');
}

// ─── ADMIN: LISTAR TODAS LAS EVALUACIONES ────────────────
if ($method === 'GET' && $action === 'admin_listar') {
    $user = requireAuth();
    // Solo admin puede ver esto
    if (($user['rol_nombre'] ?? '') !== 'admin') respondError('Sin permisos.', 403);

    $stmt = $db->prepare("
        SELECT 
            ev.id, ev.relacion, ev.tiempo_relacion,
            ev.estrellas, ev.texto_positivo, ev.texto_negativo,
            ev.recomendaria, ev.estado, ev.fecha_creacion,
            e.nombre  AS empresa_nombre,
            CONCAT(
                UPPER(LEFT(u.nombre_completo, 1)), '.',
                UPPER(LEFT(SUBSTRING_INDEX(u.nombre_completo, ' ', -1), 1)), '.'
            ) AS iniciales
        FROM evaluaciones ev
        JOIN empresas_clientes e ON ev.empresa_id = e.id
        JOIN usuarios u ON ev.usuario_id = u.id
        ORDER BY ev.fecha_creacion DESC
    ");
    $stmt->execute();
    respond(true, $stmt->fetchAll());
}

// ─── ADMIN: CAMBIAR ESTADO (visible/oculto) ───────────────
if ($method === 'POST' && $action === 'admin_estado') {
    $user = requireAuth();
    if (($user['rol_nombre'] ?? '') !== 'admin') respondError('Sin permisos.', 403);

    $body   = json_decode(file_get_contents('php://input'), true);
    $id     = $body['id']     ?? null;
    $estado = $body['estado'] ?? null;

    if (!$id || !in_array($estado, ['visible', 'oculto'])) respondError('Datos inválidos.');

    $stmt = $db->prepare("UPDATE evaluaciones SET estado = ? WHERE id = ?");
    $stmt->execute([$estado, $id]);
    respond(true, null, 'Estado actualizado.');
}

// ─── ADMIN: ELIMINAR ─────────────────────────────────────
if ($method === 'DELETE' && $action === 'admin_eliminar') {
    $user = requireAuth();
    if (($user['rol_nombre'] ?? '') !== 'admin') respondError('Sin permisos.', 403);

    $id = $_GET['id'] ?? null;
    if (!$id) respondError('ID requerido.');

    $stmt = $db->prepare("DELETE FROM evaluaciones WHERE id = ?");
    $stmt->execute([$id]);
    respond(true, null, 'Evaluación eliminada.');
}

respondError('Acción no válida.', 404);