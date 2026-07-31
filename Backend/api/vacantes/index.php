<?php
// ============================================================
// api/vacantes/index.php — Endpoints públicos de vacantes
// ============================================================

require_once __DIR__ . '/../../helpers/functions.php';
require_once __DIR__ . '/../../middleware/auth.php';

setCorsHeaders();
setSecurityHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
$db = getDB();

// ─── LISTAR VACANTES ACTIVAS ──────────────────────────────
if ($method === 'GET' && $action === 'listar') {

    $cargo       = $_GET['cargo']        ?? '';
    $ubicacion   = $_GET['ubicacion']    ?? '';
    $modalidad   = $_GET['modalidad']    ?? '';
    $tipo_contrato = $_GET['tipo_contrato'] ?? '';
    $fecha_rango = $_GET['fecha_rango']  ?? '';

    $where = [
        "o.estado = 'activa'",
        "o.fecha_expiracion > NOW()",
        "(o.fecha_publicacion IS NULL OR o.fecha_publicacion <= NOW())"
    ];
    $params = [];

    if ($cargo) {
        $where[]  = "(o.titulo LIKE ? OR o.descripcion LIKE ? OR e.nombre LIKE ?)";
        $params[] = "%$cargo%";
        $params[] = "%$cargo%";
        $params[] = "%$cargo%";
    }
    if ($ubicacion) {
        $where[]  = "o.ubicacion LIKE ?";
        $params[] = "%$ubicacion%";
    }
    if ($modalidad) {
        $where[]  = "o.modalidad = ?";
        $params[] = $modalidad;
    }
    if ($tipo_contrato) {
        $where[]  = "o.tipo_contrato = ?";
        $params[] = $tipo_contrato;
    }
    if ($fecha_rango) {
        $where[]  = "o.fecha_publicacion >= DATE_SUB(NOW(), INTERVAL ? DAY)";
        $params[] = (int)$fecha_rango;
    }

    $whereSQL = implode(' AND ', $where);

    $stmt = $db->prepare("
        SELECT
            o.id,
            o.titulo,
            o.ubicacion,
            o.salario_min,
            o.salario_max,
            o.modalidad,
            o.horario,
            o.tipo_contrato,
            o.nivel_experiencia,
            o.fecha_publicacion,
            o.fecha_expiracion,
            o.fecha_creacion,
            e.nombre   AS empresa_nombre,
            e.logo_url AS logo_url,
            c.nombre   AS categoria_nombre
        FROM ofertas_trabajo o
        JOIN empresas_clientes e ON o.empresa_id = e.id
        LEFT JOIN categorias c   ON o.categoria_id = c.id
        WHERE $whereSQL
        ORDER BY o.fecha_publicacion DESC
    ");
    $stmt->execute($params);
    respond(true, $stmt->fetchAll());
}

// ─── SUGERENCIAS (AUTOCOMPLETE) ───────────────────────────
if ($method === 'GET' && $action === 'sugerencias') {
    $q = $_GET['q'] ?? '';
    if (strlen($q) < 1) respond(true, []);

    $term = '%' . $q . '%';
    $stmt = $db->prepare("
        (SELECT DISTINCT o.titulo COLLATE utf8mb4_unicode_ci AS texto, 'cargo' AS tipo
         FROM ofertas_trabajo o
         WHERE o.estado = 'activa' AND o.titulo LIKE ? LIMIT 4)
        UNION
        (SELECT DISTINCT c.nombre COLLATE utf8mb4_unicode_ci, 'categoria'
         FROM categorias c
         WHERE c.nombre LIKE ? LIMIT 3)
        UNION
        (SELECT DISTINCT e.nombre COLLATE utf8mb4_unicode_ci, 'empresa'
         FROM empresas_clientes e
         WHERE e.nombre LIKE ? LIMIT 3)
        LIMIT 8
    ");
    $stmt->execute([$term, $term, $term]);
    respond(true, $stmt->fetchAll());
}

// ─── LISTAR CATEGORÍAS ────────────────────────────────────
if ($method === 'GET' && $action === 'categorias') {
    $stmt = $db->query("SELECT id, nombre, slug FROM categorias ORDER BY nombre ASC");
    respond(true, $stmt->fetchAll());
}

// ─── DETALLE DE VACANTE ───────────────────────────────────
if ($method === 'GET' && $action === 'detalle') {
    $id = $_GET['id'] ?? null;
    if (!$id) respondError('ID de vacante requerido.');

    $stmt = $db->prepare("
        SELECT o.*, e.nombre as empresa_nombre, e.logo_url, e.sector,
               e.descripcion as empresa_descripcion,
               c.nombre as categoria_nombre
        FROM ofertas_trabajo o
        LEFT JOIN empresas_clientes e ON o.empresa_id = e.id
        LEFT JOIN categorias c ON o.categoria_id = c.id
        WHERE o.id = ? AND o.estado = 'activa'
    ");
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if (!$row) respondError('Vacante no encontrada.', 404);

    $stmtP = $db->prepare("SELECT * FROM preguntas_oferta WHERE oferta_id = ? ORDER BY orden ASC");
    $stmtP->execute([$id]);
    $preguntas = $stmtP->fetchAll();
    foreach ($preguntas as &$p) {
        if (isset($p['opciones']) && is_string($p['opciones'])) {
            $p['opciones'] = json_decode($p['opciones'], true);
        }
    }
    unset($p);
    $row['preguntas_filtro'] = $preguntas;

    respond(true, $row);
}

// ─── MIS POSTULACIONES ────────────────────────────────────
if ($method === 'GET' && $action === 'mis_postulaciones') {
    $user = requireAuth();
    $stmt = $db->prepare("SELECT oferta_id FROM postulaciones_candidatos WHERE usuario_id = ?");
    $stmt->execute([$user['id']]);
    respond(true, $stmt->fetchAll(PDO::FETCH_COLUMN));
}

// ─── MIS POSTULACIONES (DETALLE COMPLETO) ────────────────
if ($method === 'GET' && $action === 'mis_postulaciones_detalle') {
    $user = requireAuth();

    $stmt = $db->prepare("
        SELECT 
            pc.id,
            pc.estado,
            pc.fecha_postulacion,
            o.id            AS oferta_id,
            o.titulo        AS cargo,
            e.nombre        AS empresa,
            e.logo_url,
            o.ubicacion,
            pc.cv_enviado_url
        FROM postulaciones_candidatos pc
        JOIN ofertas_trabajo o ON pc.oferta_id = o.id
        JOIN empresas_clientes e ON o.empresa_id = e.id
        WHERE pc.usuario_id = ?
        ORDER BY pc.fecha_postulacion DESC
    ");
    $stmt->execute([$user['id']]);
    respond(true, $stmt->fetchAll());
}

// ─── POSTULARSE ───────────────────────────────────────────
if ($method === 'POST' && $action === 'postular') {
    $user = requireAuth();

    $vacante_id = $_POST['vacante_id'] ?? null;
    $respuestas = isset($_POST['respuestas']) ? json_decode($_POST['respuestas'], true) : [];

    if (!$vacante_id) respondError('ID de vacante requerido.');

    $stmt = $db->prepare("SELECT id FROM ofertas_trabajo WHERE id = ? AND estado = 'activa' AND fecha_expiracion > NOW()");
    $stmt->execute([$vacante_id]);
    if (!$stmt->fetch()) respondError('Vacante no encontrada, no disponible o ya expiró.', 404);

    $stmt = $db->prepare("SELECT id FROM postulaciones_candidatos WHERE usuario_id = ? AND oferta_id = ?");
    $stmt->execute([$user['id'], $vacante_id]);
    if ($stmt->fetch()) respondError('Ya te has postulado a esta vacante.');

    $cv_url = null;
    if (isset($_FILES['cv']) && $_FILES['cv']['error'] === UPLOAD_ERR_OK) {
        $ext = pathinfo($_FILES['cv']['name'], PATHINFO_EXTENSION);
        $filename = 'cv_' . $user['id'] . '_' . time() . '.' . $ext;
        $destino = __DIR__ . '/../../uploads/cvs/' . $filename;
        move_uploaded_file($_FILES['cv']['tmp_name'], $destino);
        $cv_url = 'uploads/cvs/' . $filename;
    }

    $stmt = $db->prepare("
        INSERT INTO postulaciones_candidatos (usuario_id, oferta_id, cv_enviado_url, estado)
        VALUES (?, ?, ?, 'recibido')
    ");
    $stmt->execute([$user['id'], $vacante_id, $cv_url]);
    $postulacion_id = $db->lastInsertId();

    if (!empty($respuestas)) {
        $stmtR = $db->prepare("
            INSERT INTO respuestas_postulacion (postulacion_id, pregunta_id, respuesta_texto) VALUES (?, ?, ?)
        ");
        foreach ($respuestas as $pregunta_id => $valor) {
            $stmtR->execute([$postulacion_id, $pregunta_id, $valor]);
        }
    }

    // ─── NOTIFICAR A ADMINS ─────────────────────────────────────
    $stmtOferta = $db->prepare("
        SELECT o.titulo, e.nombre as empresa_nombre
        FROM ofertas_trabajo o
        JOIN empresas_clientes e ON o.empresa_id = e.id
        WHERE o.id = ?
    ");
    $stmtOferta->execute([$vacante_id]);
    $ofertaInfo = $stmtOferta->fetch();

    if ($ofertaInfo) {
        $notifTitulo = 'Nueva postulación';
        $notifMensaje = $user['nombre_completo'] . ' se postuló a ' . $ofertaInfo['titulo'] . ' (' . $ofertaInfo['empresa_nombre'] . ')';

        $stmtAdmins = $db->prepare("SELECT id FROM usuarios WHERE rol_id = 1");
        $stmtAdmins->execute();
        $admins = $stmtAdmins->fetchAll();

        $stmtNotif = $db->prepare("
            INSERT INTO notificaciones (usuario_id, tipo, titulo, mensaje, referencia_tipo, referencia_id)
            VALUES (?, 'nueva_postulacion', ?, ?, 'postulacion', ?)
        ");
        foreach ($admins as $admin) {
            $stmtNotif->execute([$admin['id'], $notifTitulo, $notifMensaje, $postulacion_id]);
        }
    }

    respond(true, ['id' => $postulacion_id], 'Te has postulado exitosamente.');
}

respondError('Acción no válida.', 404);
