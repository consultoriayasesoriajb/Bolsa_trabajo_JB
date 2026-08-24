<?php
require_once __DIR__ . '/../../helpers/functions.php';
require_once __DIR__ . '/../../middleware/auth.php';

setCorsHeaders();
setSecurityHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
$db = getDB();

// ─── EMPRESAS DESTACADAS (top 3 por promedio) ────────────
if ($method === 'GET' && $action === 'destacadas') {
    $stmt = $db->query("
        SELECT
            e.id, e.nombre, e.slug, e.sector, e.logo_url,
            ROUND(AVG(ev.estrellas), 1)  AS promedio,
            COUNT(DISTINCT ev.id)        AS total_evaluaciones,
            COUNT(DISTINCT o.id)         AS total_ofertas
        FROM empresas_clientes e
        LEFT JOIN evaluaciones ev ON ev.empresa_id = e.id AND ev.estado = 'visible'
        LEFT JOIN ofertas_trabajo o ON o.empresa_id = e.id AND o.estado = 'activa'
        GROUP BY e.id
        HAVING promedio IS NOT NULL
        ORDER BY promedio DESC
        LIMIT 3
    ");
    respond(true, $stmt->fetchAll());
}

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
            e.id, e.nombre, e.slug, e.sector, e.logo_url,
            e.descripcion, e.anio_fundacion, e.num_empleados,
            e.sitio_web, e.ubicacion, e.beneficios, e.ruc,
            ROUND(AVG(ev.estrellas), 1) AS promedio,
            COUNT(ev.id)               AS total_evaluaciones,
            COUNT(DISTINCT o.id)         AS total_ofertas
        FROM empresas_clientes e
        LEFT JOIN evaluaciones ev ON ev.empresa_id = e.id AND ev.estado = 'visible'
        LEFT JOIN ofertas_trabajo o ON o.empresa_id = e.id AND o.estado = 'activa'
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
            e.id, e.nombre, e.slug, e.sector, e.logo_url,
            e.descripcion, e.anio_fundacion, e.num_empleados,
            e.sitio_web, e.ubicacion, e.beneficios, e.ruc,
            ROUND(AVG(ev.estrellas), 1)       AS promedio,
            COUNT(ev.id)                      AS total_evaluaciones,
            ROUND(AVG(ev.cat_ambiente), 1)    AS prom_ambiente,
            ROUND(AVG(ev.cat_beneficios), 1)  AS prom_beneficios,
            ROUND(AVG(ev.cat_balance), 1)     AS prom_balance,
            ROUND(AVG(ev.cat_crecimiento), 1) AS prom_crecimiento,
            SUM(CASE WHEN ev.estrellas = 5 THEN 1 ELSE 0 END) AS est_5,
            SUM(CASE WHEN ev.estrellas = 4 THEN 1 ELSE 0 END) AS est_4,
            SUM(CASE WHEN ev.estrellas = 3 THEN 1 ELSE 0 END) AS est_3,
            SUM(CASE WHEN ev.estrellas = 2 THEN 1 ELSE 0 END) AS est_2,
            SUM(CASE WHEN ev.estrellas = 1 THEN 1 ELSE 0 END) AS est_1
        FROM empresas_clientes e
        LEFT JOIN evaluaciones ev ON ev.empresa_id = e.id AND ev.estado = 'visible'
        WHERE e.slug = ? OR e.id = ?
        GROUP BY e.id
    ");
    $stmt->execute([$empresa_id, $empresa_id]);
    $empresa = $stmt->fetch();
    if (!$empresa) respondError('Empresa no encontrada.', 404);

    if ($empresa['beneficios']) {
        $empresa['beneficios'] = json_decode($empresa['beneficios'], true);
    }

    $idReal = $empresa['id']; // ← ID numérico real

    $stmtEv = $db->prepare("
        SELECT 
            ev.id, ev.relacion, ev.tiempo_relacion,
            ev.estrellas, ev.texto_positivo, ev.texto_negativo,
            ev.recomendaria, 
            ev.cat_ambiente, ev.cat_beneficios, ev.cat_balance, ev.cat_crecimiento, 
            ev.fecha_creacion,
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
    $stmtEv->execute([$idReal]); // ← usa el ID numérico, no el slug
    $empresa['evaluaciones'] = $stmtEv->fetchAll();

    respond(true, $empresa);
}

// ─── VERIFICAR SI YA EVALUÓ ──────────────────────────────
if ($method === 'GET' && $action === 'ya_evaluo') {
    $user = requireAuth();
    $empresa_id = $_GET['empresa_id'] ?? null;
    if (!$empresa_id) respondError('ID de empresa requerido.');

    // Resolver slug o id al id real
    $stmtEmp = $db->prepare("SELECT id FROM empresas_clientes WHERE slug = ? OR id = ?");
    $stmtEmp->execute([$empresa_id, $empresa_id]);
    $empresa = $stmtEmp->fetch();
    if (!$empresa) respond(true, ['ya_evaluo' => false]);

    $stmt = $db->prepare("
        SELECT id FROM evaluaciones 
        WHERE usuario_id = ? AND empresa_id = ?
    ");
    $stmt->execute([$user['id'], $empresa['id']]);
    respond(true, ['ya_evaluo' => (bool)$stmt->fetch()]);
}

// ─── CREAR EVALUACIÓN ────────────────────────────────────
if ($method === 'POST' && $action === 'crear') {
    $user = requireAuth();
    $body = json_decode(file_get_contents('php://input'), true);

    $empresa_id      = $body['empresa_id']      ?? null;
    $relacion        = $body['relacion']         ?? null;
    $tiempo_relacion = $body['tiempo_relacion']  ?? null;
    $estrellas       = $body['estrellas']        ?? null;
    $texto_positivo  = $body['texto_positivo']   ?? null;
    $texto_negativo  = $body['texto_negativo']   ?? null;
    $recomendaria    = $body['recomendaria']     ?? null;
    $cat_ambiente    = $body['cat_ambiente']     ?? null;
    $cat_beneficios  = $body['cat_beneficios']   ?? null;
    $cat_balance     = $body['cat_balance']      ?? null;
    $cat_crecimiento = $body['cat_crecimiento']  ?? null;

    if (!$empresa_id || !$relacion || !$tiempo_relacion || !$estrellas || !$recomendaria) {
        respondError('Faltan campos obligatorios.');
    }

    // Validar categorías (obligatorias para nuevas evaluaciones)
    if (!$cat_ambiente || !$cat_beneficios || !$cat_balance || !$cat_crecimiento) {
        respondError('Debes calificar todas las categorías.');
    }

    // Validar rango 1-5
    foreach ([$estrellas, $cat_ambiente, $cat_beneficios, $cat_balance, $cat_crecimiento] as $val) {
        if ($val < 1 || $val > 5) respondError('Las calificaciones deben estar entre 1 y 5.');
    }

    if ($estrellas < 1 || $estrellas > 5) respondError('Las estrellas deben estar entre 1 y 5.');

    $stmt = $db->prepare("SELECT id FROM evaluaciones WHERE usuario_id = ? AND empresa_id = ?");
    $stmt->execute([$user['id'], $empresa_id]);
    if ($stmt->fetch()) respondError('Ya has evaluado esta empresa.');

    $stmt = $db->prepare("
        INSERT INTO evaluaciones (
            usuario_id, empresa_id, relacion, tiempo_relacion,
            estrellas, texto_positivo, texto_negativo, recomendaria,
            cat_ambiente, cat_beneficios, cat_balance, cat_crecimiento
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([
        $user['id'], $empresa_id, $relacion, $tiempo_relacion,
        $estrellas, $texto_positivo, $texto_negativo, $recomendaria,
        $cat_ambiente, $cat_beneficios, $cat_balance, $cat_crecimiento
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

// ─── OFERTAS DE UNA EMPRESA ──────────────────────────────
if ($method === 'GET' && $action === 'ofertas_empresa') {
    $empresa_id = $_GET['empresa_id'] ?? null;
    if (!$empresa_id) respondError('empresa_id requerido.');

    $stmtEmp = $db->prepare("SELECT id FROM empresas_clientes WHERE slug = ? OR id = ?");
    $stmtEmp->execute([$empresa_id, $empresa_id]);
    $empresa = $stmtEmp->fetch();
    if (!$empresa) respondError('Empresa no encontrada.', 404);

    $stmt = $db->prepare("
        SELECT
            o.id, o.titulo, o.ubicacion, o.modalidad, o.horario,
            o.tipo_contrato, o.salario_min, o.salario_max,
            o.descripcion, o.fecha_publicacion, o.fecha_expiracion,
            o.nivel_experiencia, o.fecha_creacion
        FROM ofertas_trabajo o
        WHERE o.empresa_id = ?
          AND o.estado = 'activa'
          AND o.fecha_expiracion > NOW()
        ORDER BY o.fecha_publicacion DESC
    ");
    $stmt->execute([$empresa['id']]);
    respond(true, $stmt->fetchAll());
}


respondError('Acción no válida.', 404);