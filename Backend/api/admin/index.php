<?php
// ============================================================
// api/admin/index.php — Gestión exclusiva para Administradores
// ============================================================

require_once __DIR__ . '/../../helpers/functions.php';
require_once __DIR__ . '/../../middleware/auth.php';

setCorsHeaders();
setSecurityHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$resource = $_GET['resource'] ?? ''; // Ej: categorias, empresas, ofertas
$action = $_GET['action'] ?? '';     // Ej: listar, crear, editar
$db = getDB();

// ─── PROTECCIÓN DE RUTA (SOLO ADMIN) ─────────────────────────
// requireAdmin() debe verificar el token JWT y asegurarse de que el rol_id sea 1.
$admin = requireAdmin(); 

// ============================================================
// MÓDULO: CATEGORÍAS
// ============================================================
if ($resource === 'categorias') {
    
    // LISTAR CATEGORÍAS
    if ($method === 'GET' && $action === 'listar') {
        $stmt = $db->query("SELECT * FROM categorias ORDER BY nombre ASC");
        respond(true, $stmt->fetchAll());
    }

    // CREAR CATEGORÍA
    if ($method === 'POST' && $action === 'crear') {
        $body = getBody();
        $nombre = sanitizarTexto($body['nombre'] ?? '');
        
        if (!$nombre) respondError('El nombre de la categoría es requerido.');

        // Crear un slug básico a partir del nombre (ej: "Desarrollo Web" -> "desarrollo-web")
        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $nombre)));

        try {
            $stmt = $db->prepare("INSERT INTO categorias (nombre, slug) VALUES (?, ?)");
            $stmt->execute([$nombre, $slug]);
            respond(true, ['id' => $db->lastInsertId(), 'nombre' => $nombre, 'slug' => $slug], 'Categoría creada con éxito.');
        } catch (PDOException $e) {
            if (strpos($e->getMessage(), 'Duplicate entry') !== false) {
                respondError('Ya existe una categoría con ese nombre.');
            }
            respondError('Error de base de datos al crear categoría.');
        }
    }

    // EDITAR CATEGORÍA
    if ($method === 'POST' && $action === 'editar') {
        $body = getBody();
        $id = $body['id'] ?? null;
        $nombre = sanitizarTexto($body['nombre'] ?? '');

        if (!$id) respondError('ID de categoría requerido.');
        if (!$nombre) respondError('El nombre de la categoría es requerido.');

        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $nombre)));

        try {
            $stmt = $db->prepare("UPDATE categorias SET nombre = ?, slug = ? WHERE id = ?");
            $stmt->execute([$nombre, $slug, $id]);
            respond(true, [], 'Categoría actualizada correctamente.');
        } catch (PDOException $e) {
            if (strpos($e->getMessage(), 'Duplicate entry') !== false) {
                respondError('Ya existe una categoría con ese nombre.');
            }
            respondError('Error al actualizar categoría.');
        }
    }

    // ELIMINAR CATEGORÍA
    if ($method === 'POST' && $action === 'eliminar') {
        $body = getBody();
        $id = $body['id'] ?? null;
        if (!$id) respondError('ID de categoría requerido.');

        $stmt = $db->prepare("SELECT COUNT(*) as total FROM ofertas_trabajo WHERE categoria_id = ?");
        $stmt->execute([$id]);
        $count = $stmt->fetch();
        if ($count['total'] > 0) {
            respondError('No se puede eliminar: hay ofertas asociadas a esta categoría.');
        }

        $stmt = $db->prepare("DELETE FROM categorias WHERE id = ?");
        $stmt->execute([$id]);
        respond(true, [], 'Categoría eliminada correctamente.');
    }
}

// ============================================================
// MÓDULO: EMPRESAS CLIENTES
// ============================================================
if ($resource === 'empresas') {

    // LISTAR EMPRESAS
    if ($method === 'GET' && $action === 'listar') {
        $stmt = $db->query("
            SELECT id, nombre, ruc, sector, logo_url, descripcion,
                ubicacion, anio_fundacion, num_empleados, sitio_web, beneficios,
                estado, fecha_registro
            FROM empresas_clientes
            ORDER BY fecha_registro DESC
        ");
        respond(true, $stmt->fetchAll());
    }

    // CREAR EMPRESA
    if ($method === 'POST' && $action === 'crear') {
        $nombre      = sanitizarTexto($_POST['nombre']      ?? '');
        $ruc         = sanitizarTexto($_POST['ruc']         ?? '');
        $sector      = sanitizarTexto($_POST['sector']      ?? '');
        $descripcion = sanitizarTexto($_POST['descripcion'] ?? '');
        $ubicacion   = sanitizarTexto($_POST['ubicacion']   ?? '');
        $anio        = !empty($_POST['anio_fundacion']) ? (int)$_POST   ['anio_fundacion'] : null;
        $empleados   = sanitizarTexto($_POST['num_empleados'] ?? '');
        $web         = sanitizarTexto($_POST['sitio_web']   ?? '');
        $beneficios  = $_POST['beneficios'] ?? '[]';

        if (!$nombre || !$ruc || !$sector) {
            respondError('Los campos nombre, ruc y sector son obligatorios.');
        }

        // Validar que beneficios sea JSON válido
        if (!json_decode($beneficios)) $beneficios = '[]';

        $logo_url = null;
        if (isset($_FILES['logo']) && $_FILES['logo']['error'] ===  UPLOAD_ERR_OK) {
            $ext = trim(strtolower(pathinfo($_FILES['logo']['name'], PATHINFO_EXTENSION)));
            $allowed = ['jpg', 'jpeg', 'png', 'webp', 'svg'];
            if (!in_array($ext, $allowed)) respondError('Formato de imagen no válido.');
            if ($_FILES['logo']['size'] > 2 * 1024 * 1024) respondError('La imagen no debe superar 2MB.');
            $filename = 'logo_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
            $uploadDir = __DIR__ . '/../../uploads/logos/';
            if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
            $destino = $uploadDir . $filename;
            move_uploaded_file($_FILES['logo']['tmp_name'], $destino);
            $logo_url = 'uploads/logos/' . $filename;
        }

        try {
            $stmt = $db->prepare("
                INSERT INTO empresas_clientes
                    (nombre, ruc, sector, logo_url, descripcion, ubicacion,
                    anio_fundacion, num_empleados, sitio_web, beneficios, estado)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'activo')
            ");
            $stmt->execute([
                $nombre, $ruc, $sector, $logo_url, $descripcion, $ubicacion,
                $anio, $empleados ?: null, $web ?: null, $beneficios
            ]);
            respond(true, ['id' => $db->lastInsertId()], 'Empresa registrada correctamente.');
        } catch (PDOException $e) {
            if (strpos($e->getMessage(), 'Duplicate entry') !== false) {
                respondError('Ya existe una empresa con ese RUC o Nombre.');
            }
            respondError('Error de base de datos al registrar empresa.');
        }
    }

    // EDITAR EMPRESA
    if ($method === 'POST' && $action === 'editar') {
        $id          = $_POST['id'] ?? null;
        $nombre      = sanitizarTexto($_POST['nombre']      ?? '');
        $ruc         = sanitizarTexto($_POST['ruc']         ?? '');
        $sector      = sanitizarTexto($_POST['sector']      ?? '');
        $descripcion = sanitizarTexto($_POST['descripcion'] ?? '');
        $ubicacion   = sanitizarTexto($_POST['ubicacion']   ?? '');
        $anio        = !empty($_POST['anio_fundacion']) ? (int)$_POST   ['anio_fundacion'] : null;
        $empleados   = sanitizarTexto($_POST['num_empleados'] ?? '');
        $web         = sanitizarTexto($_POST['sitio_web']   ?? '');
        $beneficios  = $_POST['beneficios'] ?? '[]';

        if (!$id) respondError('ID de empresa requerido.');
        if (!json_decode($beneficios)) $beneficios = '[]';

        $stmt = $db->prepare("SELECT id, logo_url FROM empresas_clientes    WHERE id = ?");
        $stmt->execute([$id]);
        $empresa = $stmt->fetch();
        if (!$empresa) respondError('Empresa no encontrada.', 404);

        $logo_url = $empresa['logo_url'];
        if (isset($_FILES['logo']) && $_FILES['logo']['error'] === UPLOAD_ERR_OK) {
            $ext = trim(strtolower(pathinfo($_FILES['logo']['name'], PATHINFO_EXTENSION)));
            $allowed = ['jpg', 'jpeg', 'png', 'webp', 'svg'];
            if (!in_array($ext, $allowed)) respondError('Formato de imagen no   válido.');
            if ($_FILES['logo']['size'] > 2 * 1024 * 1024) respondError('La     imagen no debe superar 2MB.');
            if ($empresa['logo_url'] && file_exists(__DIR__ . '/../../' .   $empresa['logo_url'])) {
                unlink(__DIR__ . '/../../' . $empresa['logo_url']);
            }
            $filename = 'logo_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
            $uploadDir = __DIR__ . '/../../uploads/logos/';
            if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
            $destino = $uploadDir . $filename;
            move_uploaded_file($_FILES['logo']['tmp_name'], $destino);
            $logo_url = 'uploads/logos/' . $filename;
        }

        try {
            $stmt = $db->prepare("
                UPDATE empresas_clientes
                SET nombre = ?, ruc = ?, sector = ?, logo_url = ?,  descripcion = ?,
                    ubicacion = ?, anio_fundacion = ?, num_empleados = ?,
                    sitio_web = ?, beneficios = ?
                WHERE id = ?
            ");
            $stmt->execute([
                $nombre, $ruc, $sector, $logo_url, $descripcion, $ubicacion,
                $anio, $empleados ?: null, $web ?: null, $beneficios, $id
            ]);
            respond(true, [], 'Empresa actualizada correctamente.');
        } catch (PDOException $e) {
            if (strpos($e->getMessage(), 'Duplicate entry') !== false) {
                respondError('Ya existe otra empresa con ese RUC o Nombre.');
            }
            respondError('Error al actualizar empresa.');
        }
    }

    // ELIMINAR EMPRESA
    if ($method === 'POST' && $action === 'eliminar') {
        $id = $_POST['id'] ?? null;
        if (!$id) respondError('ID de empresa requerido.');

        $stmt = $db->prepare("SELECT COUNT(*) as total FROM ofertas_trabajo WHERE empresa_id = ? AND estado = 'activa'");
        $stmt->execute([$id]);
        $count = $stmt->fetch();
        if ($count['total'] > 0) {
            respondError('No se puede eliminar: la empresa tiene ofertas activas.');
        }

        $stmt = $db->prepare("SELECT id, logo_url FROM empresas_clientes WHERE id = ?");
        $stmt->execute([$id]);
        $empresa = $stmt->fetch();
        if (!$empresa) respondError('Empresa no encontrada.', 404);

        if ($empresa['logo_url'] && file_exists(__DIR__ . '/../../' . $empresa['logo_url'])) {
            unlink(__DIR__ . '/../../' . $empresa['logo_url']);
        }

        $stmt = $db->prepare("DELETE FROM empresas_clientes WHERE id = ?");
        $stmt->execute([$id]);
        respond(true, [], 'Empresa eliminada correctamente.');
    }
}

// ============================================================
// MÓDULO: OFERTAS DE TRABAJO
// ============================================================
if ($resource === 'ofertas') {

    // LISTAR OFERTAS
    if ($method === 'GET' && $action === 'listar') {
        $stmt = $db->query("
            SELECT o.*, e.nombre as empresa_nombre, c.nombre as categoria_nombre 
            FROM ofertas_trabajo o 
            LEFT JOIN empresas_clientes e ON o.empresa_id = e.id 
            LEFT JOIN categorias c ON o.categoria_id = c.id 
            WHERE o.estado != 'eliminada'
            ORDER BY o.fecha_creacion DESC
        ");
        respond(true, $stmt->fetchAll());
    }

    // CREAR OFERTA
    if ($method === 'POST' && $action === 'crear') {
        $body = getBody();

        $empresa_id = $body['empresa_id'] ?? null;
        $titulo = sanitizarTexto($body['titulo'] ?? '');
        $descripcion = sanitizarTexto($body['descripcion'] ?? '');

        if (!$empresa_id || !$titulo || !$descripcion) {
            respondError('La empresa (empresa_id), el título y la descripción son obligatorios.');
        }

        $slugBase = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $titulo)));
        $slug = $slugBase . '-' . substr(time(), -5);

        $requisitos = isset($body['requisitos']) ? sanitizarTexto($body['requisitos']) : null;
        $salario_min = isset($body['salario_min']) && is_numeric($body['salario_min']) ? $body['salario_min'] : null;
        $salario_max = isset($body['salario_max']) && is_numeric($body['salario_max']) ? $body['salario_max'] : null;
        $ubicacion = isset($body['ubicacion']) ? sanitizarTexto($body['ubicacion']) : null;
        $categoria_id = $body['categoria_id'] ?? null;
        
        $modalidad = isset($body['modalidad']) && in_array($body['modalidad'], ['presencial', 'remoto', 'Híbrida']) ? $body['modalidad'] : 'presencial';
        $tipo_contrato = isset($body['tipo_contrato']) && in_array($body['tipo_contrato'], ['Tiempo completo', 'Permanente', 'Medio tiempo', 'Freelance', 'Prácticas', 'Temporal']) ? $body['tipo_contrato'] : 'Tiempo completo';
        $nivel_experiencia = isset($body['nivel_experiencia']) && in_array($body['nivel_experiencia'], ['junior', 'semisenior', 'senior', 'gerente']) ? $body['nivel_experiencia'] : null;
        $horario = isset($body['horario']) ? sanitizarTexto($body['horario']) : null;
        $estado = isset($body['estado']) && in_array($body['estado'], ['activa', 'pausada', 'eliminada']) ? $body['estado'] : 'activa';

        $fecha_publicacion = !empty($body['fecha_publicacion']) ? $body['fecha_publicacion'] : null;
        $fecha_expiracion = !empty($body['fecha_expiracion']) ? $body['fecha_expiracion'] : null;

        try {
            $stmt = $db->prepare("
                INSERT INTO ofertas_trabajo (
                    empresa_id, titulo, slug, descripcion, requisitos, 
                    salario_min, salario_max, ubicacion, modalidad, horario, tipo_contrato, nivel_experiencia, categoria_id, estado,
                    fecha_publicacion, fecha_expiracion
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, IFNULL(?, DATE_ADD(NOW(), INTERVAL 90 DAY)))
            ");
            
            $stmt->execute([
                $empresa_id, $titulo, $slug, $descripcion, $requisitos,
                $salario_min, $salario_max, $ubicacion, $modalidad, $horario,
                $tipo_contrato, $nivel_experiencia, $categoria_id, $estado,
                $fecha_publicacion, $fecha_expiracion
            ]);
            
            respond(true, [
                'id' => $db->lastInsertId(), 
                'slug' => $slug
            ], 'Oferta de trabajo creada exitosamente.');

        } catch (PDOException $e) {
            if (strpos($e->getMessage(), 'a foreign key constraint fails') !== false) {
                respondError('Error: El ID de la empresa o la categoría no existe en la base de datos.');
            }
            respondError('Error interno en la base de datos al crear la oferta.');
        }
    }

    // EDITAR OFERTA
    if ($method === 'POST' && $action === 'editar') {
        $body = getBody();
        $id = $body['id'] ?? null;

        if (!$id) respondError('ID de oferta requerido.');

        $stmt = $db->prepare("SELECT id, slug FROM ofertas_trabajo WHERE id = ?");
        $stmt->execute([$id]);
        $oferta = $stmt->fetch();
        if (!$oferta) respondError('Oferta no encontrada.', 404);

        $titulo = isset($body['titulo']) ? sanitizarTexto($body['titulo']) : null;
        $empresa_id = $body['empresa_id'] ?? null;
        $descripcion = isset($body['descripcion']) ? sanitizarTexto($body['descripcion']) : null;
        $requisitos = isset($body['requisitos']) ? sanitizarTexto($body['requisitos']) : null;
        $salario_min = isset($body['salario_min']) && is_numeric($body['salario_min']) ? $body['salario_min'] : null;
        $salario_max = isset($body['salario_max']) && is_numeric($body['salario_max']) ? $body['salario_max'] : null;
        $ubicacion = isset($body['ubicacion']) ? sanitizarTexto($body['ubicacion']) : null;
        $categoria_id = $body['categoria_id'] ?? null;

        $modalidad = isset($body['modalidad']) && in_array($body['modalidad'], ['presencial', 'remoto', 'Híbrida']) ? $body['modalidad'] : null;
        $tipo_contrato = isset($body['tipo_contrato']) && in_array($body['tipo_contrato'], ['Tiempo completo', 'Permanente', 'Medio tiempo', 'Freelance', 'Prácticas', 'Temporal']) ? $body['tipo_contrato'] : null;
        $horario = isset($body['horario']) ? sanitizarTexto($body['horario']) : null;
        $nivel_experiencia = isset($body['nivel_experiencia']) && in_array($body['nivel_experiencia'], ['junior', 'semisenior', 'senior', 'gerente']) ? $body['nivel_experiencia'] : null;
        $estado = isset($body['estado']) && in_array($body['estado'], ['activa', 'pausada', 'eliminada']) ? $body['estado'] : null;

        $fecha_publicacion = isset($body['fecha_publicacion']) ? ($body['fecha_publicacion'] ?: null) : null;
        $fecha_expiracion = isset($body['fecha_expiracion']) ? ($body['fecha_expiracion'] ?: null) : null;

        $slug = $oferta['slug'];
        if ($titulo) {
            $slugBase = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $titulo)));
            $slug = $slugBase . '-' . substr(time(), -5);
        }

        try {
            $campos = [];
            $valores = [];

            if ($titulo !== null) { $campos[] = 'titulo = ?'; $valores[] = $titulo; }
            if ($slug !== $oferta['slug']) { $campos[] = 'slug = ?'; $valores[] = $slug; }
            if ($empresa_id !== null) { $campos[] = 'empresa_id = ?'; $valores[] = $empresa_id; }
            if ($descripcion !== null) { $campos[] = 'descripcion = ?'; $valores[] = $descripcion; }
            if ($requisitos !== null) { $campos[] = 'requisitos = ?'; $valores[] = $requisitos; }
            if ($salario_min !== null) { $campos[] = 'salario_min = ?'; $valores[] = $salario_min; }
            if ($salario_max !== null) { $campos[] = 'salario_max = ?'; $valores[] = $salario_max; }
            if ($ubicacion !== null) { $campos[] = 'ubicacion = ?'; $valores[] = $ubicacion; }
            if ($categoria_id !== null) { $campos[] = 'categoria_id = ?'; $valores[] = $categoria_id; }
            if ($modalidad !== null) { $campos[] = 'modalidad = ?'; $valores[] = $modalidad; }
            if ($horario !== null) { $campos[] = 'horario = ?'; $valores[] = $horario; }
            if ($tipo_contrato !== null) { $campos[] = 'tipo_contrato = ?'; $valores[] = $tipo_contrato; }
            if ($nivel_experiencia !== null) { $campos[] = 'nivel_experiencia = ?'; $valores[] = $nivel_experiencia; }
            if ($estado !== null) { $campos[] = 'estado = ?'; $valores[] = $estado; }
            if ($fecha_publicacion !== null) { $campos[] = 'fecha_publicacion = ?'; $valores[] = $fecha_publicacion; }
            if ($fecha_expiracion !== null) { $campos[] = 'fecha_expiracion = ?'; $valores[] = $fecha_expiracion; }

            if (empty($campos)) {
                respondError('No se enviaron campos para actualizar.');
            }

            $valores[] = $id;
            $stmt = $db->prepare("UPDATE ofertas_trabajo SET " . implode(', ', $campos) . " WHERE id = ?");
            $stmt->execute($valores);

            respond(true, [], 'Oferta actualizada correctamente.');

        } catch (PDOException $e) {
            if (strpos($e->getMessage(), 'Duplicate entry') !== false) {
                respondError('Ya existe otra oferta con ese título (slug duplicado).');
            }
            if (strpos($e->getMessage(), 'a foreign key constraint fails') !== false) {
                respondError('Error: El ID de la empresa o la categoría no existe.');
            }
            respondError('Error al actualizar la oferta.');
        }
    }

    // ELIMINAR OFERTA (soft delete)
    if ($method === 'POST' && $action === 'eliminar') {
        $body = getBody();
        $id = $body['id'] ?? null;
        if (!$id) respondError('ID de oferta requerido.');

        $stmt = $db->prepare("SELECT id FROM ofertas_trabajo WHERE id = ? AND estado != 'eliminada'");
        $stmt->execute([$id]);
        if (!$stmt->fetch()) respondError('Oferta no encontrada o ya eliminada.', 404);

        $stmt = $db->prepare("UPDATE ofertas_trabajo SET estado = 'eliminada' WHERE id = ?");
        $stmt->execute([$id]);

        respond(true, [], 'Oferta eliminada correctamente.');
    }

    // TOGGLE ESTADO (activa <-> pausada)
    if ($method === 'POST' && $action === 'toggle_estado') {
        $body = getBody();
        $id = $body['id'] ?? null;
        if (!$id) respondError('ID de oferta requerido.');

        $stmt = $db->prepare("SELECT id, estado FROM ofertas_trabajo WHERE id = ? AND estado != 'eliminada'");
        $stmt->execute([$id]);
        $oferta = $stmt->fetch();
        if (!$oferta) respondError('Oferta no encontrada.', 404);

        $nuevoEstado = $oferta['estado'] === 'activa' ? 'pausada' : 'activa';

        $stmt = $db->prepare("UPDATE ofertas_trabajo SET estado = ? WHERE id = ?");
        $stmt->execute([$nuevoEstado, $id]);

        respond(true, ['estado' => $nuevoEstado], 'Estado de la oferta actualizado.');
    }

    // CERRAR OFERTA (expirar inmediatamente)
    if ($method === 'POST' && $action === 'cerrar') {
        $body = getBody();
        $id = $body['id'] ?? null;
        if (!$id) respondError('ID de oferta requerido.');

        $stmt = $db->prepare("SELECT id, estado FROM ofertas_trabajo WHERE id = ? AND estado != 'eliminada'");
        $stmt->execute([$id]);
        $oferta = $stmt->fetch();
        if (!$oferta) respondError('Oferta no encontrada.', 404);
        if ($oferta['estado'] !== 'activa') respondError('Solo se pueden cerrar ofertas activas.');

        $stmt = $db->prepare("UPDATE ofertas_trabajo SET fecha_expiracion = NOW() WHERE id = ?");
        $stmt->execute([$id]);

        respond(true, [], 'Oferta cerrada correctamente.');
    }
}

// ============================================================
// MÓDULO: PREGUNTAS DE FILTRO (por oferta)
// ============================================================
if ($resource === 'preguntas') {

    // LISTAR PREGUNTAS DE UNA OFERTA
    if ($method === 'GET' && $action === 'listar') {
        $oferta_id = $_GET['oferta_id'] ?? null;
        if (!$oferta_id) respondError('oferta_id es requerido.');

        $stmt = $db->prepare("SELECT * FROM preguntas_oferta WHERE oferta_id = ? ORDER BY orden ASC");
        $stmt->execute([$oferta_id]);
        respond(true, $stmt->fetchAll());
    }

    // CREAR PREGUNTA
    if ($method === 'POST' && $action === 'crear') {
        $body = getBody();
        $oferta_id = $body['oferta_id'] ?? null;
        $pregunta = sanitizarTexto($body['pregunta'] ?? '');
        $tipo = $body['tipo'] ?? 'texto';
        $obligatoria = isset($body['obligatoria']) ? (int)$body['obligatoria'] : 0;
        $opciones = $body['opciones'] ?? null;

        if (!$oferta_id || !$pregunta) respondError('oferta_id y pregunta son requeridos.');
        if (!in_array($tipo, ['si_no', 'opciones', 'texto', 'numero'])) respondError('Tipo de pregunta no válido.');

        $stmt = $db->prepare("SELECT COALESCE(MAX(orden), 0) + 1 as next_orden FROM preguntas_oferta WHERE oferta_id = ?");
        $stmt->execute([$oferta_id]);
        $orden = $stmt->fetch()['next_orden'];

        $opcionesJson = is_array($opciones) ? json_encode($opciones) : null;

        try {
            $stmt = $db->prepare("INSERT INTO preguntas_oferta (oferta_id, pregunta, tipo, obligatoria, orden, opciones) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([$oferta_id, $pregunta, $tipo, $obligatoria, $orden, $opcionesJson]);
            respond(true, ['id' => $db->lastInsertId(), 'orden' => $orden], 'Pregunta creada con éxito.');
        } catch (PDOException $e) {
            respondError('Error al crear la pregunta.');
        }
    }

    // EDITAR PREGUNTA
    if ($method === 'POST' && $action === 'editar') {
        $body = getBody();
        $id = $body['id'] ?? null;
        if (!$id) respondError('ID de pregunta requerido.');

        $pregunta = isset($body['pregunta']) ? sanitizarTexto($body['pregunta']) : null;
        $tipo = $body['tipo'] ?? null;
        $obligatoria = isset($body['obligatoria']) ? (int)$body['obligatoria'] : null;
        $opciones = $body['opciones'] ?? null;

        if ($tipo && !in_array($tipo, ['si_no', 'opciones', 'texto', 'numero'])) respondError('Tipo de pregunta no válido.');

        try {
            $campos = [];
            $valores = [];

            if ($pregunta !== null) { $campos[] = 'pregunta = ?'; $valores[] = $pregunta; }
            if ($tipo !== null) { $campos[] = 'tipo = ?'; $valores[] = $tipo; }
            if ($obligatoria !== null) { $campos[] = 'obligatoria = ?'; $valores[] = $obligatoria; }
            if ($opciones !== null) { $campos[] = 'opciones = ?'; $valores[] = is_array($opciones) ? json_encode($opciones) : null; }

            if (empty($campos)) respondError('No se enviaron campos para actualizar.');

            $valores[] = $id;
            $stmt = $db->prepare("UPDATE preguntas_oferta SET " . implode(', ', $campos) . " WHERE id = ?");
            $stmt->execute($valores);
            respond(true, [], 'Pregunta actualizada correctamente.');
        } catch (PDOException $e) {
            respondError('Error al actualizar la pregunta.');
        }
    }

    // ELIMINAR PREGUNTA
    if ($method === 'POST' && $action === 'eliminar') {
        $body = getBody();
        $id = $body['id'] ?? null;
        if (!$id) respondError('ID de pregunta requerido.');

        $stmt = $db->prepare("DELETE FROM preguntas_oferta WHERE id = ?");
        $stmt->execute([$id]);
        respond(true, [], 'Pregunta eliminada correctamente.');
    }

    // ELIMINAR TODAS LAS PREGUNTAS DE UNA OFERTA (para reemplazar en edición)
    if ($method === 'POST' && $action === 'eliminar_por_oferta') {
        $body = getBody();
        $oferta_id = $body['oferta_id'] ?? null;
        if (!$oferta_id) respondError('oferta_id requerido.');

        $stmt = $db->prepare("DELETE FROM preguntas_oferta WHERE oferta_id = ?");
        $stmt->execute([$oferta_id]);
        respond(true, [], 'Preguntas eliminadas.');
    }
}

// ============================================================
// MÓDULO: POSTULACIONES
// ============================================================
if ($resource === 'postulaciones') {

    // LISTAR POSTULACIONES
    if ($method === 'GET' && $action === 'listar') {
        $stmt = $db->query("
            SELECT p.id, p.usuario_id, p.oferta_id, p.cv_enviado_url, p.estado,
                   p.notas_internas, p.fecha_postulacion,
                   u.nombre_completo as candidato_nombre, u.correo as candidato_correo,
                   u.telefono as candidato_telefono, u.cv_url as usuario_cv_url,
                   o.titulo as oferta_titulo, e.nombre as empresa_nombre
            FROM postulaciones_candidatos p
            JOIN usuarios u ON p.usuario_id = u.id
            JOIN ofertas_trabajo o ON p.oferta_id = o.id
            JOIN empresas_clientes e ON o.empresa_id = e.id
            ORDER BY p.fecha_postulacion DESC
        ");
        respond(true, $stmt->fetchAll());
    }

    // DETALLE DE POSTULACIÓN
    if ($method === 'GET' && $action === 'detalle') {
        $id = $_GET['id'] ?? null;
        if (!$id) respondError('ID requerido.');

        $stmt = $db->prepare("
            SELECT p.id, p.usuario_id, p.oferta_id, p.cv_enviado_url, p.estado,
                   p.notas_internas, p.fecha_postulacion,
                   u.nombre_completo as candidato_nombre, u.correo as candidato_correo,
                   u.telefono as candidato_telefono, u.cv_url as usuario_cv_url,
                   u.texto_presentacion,
                   o.titulo as oferta_titulo, e.nombre as empresa_nombre
            FROM postulaciones_candidatos p
            JOIN usuarios u ON p.usuario_id = u.id
            JOIN ofertas_trabajo o ON p.oferta_id = o.id
            JOIN empresas_clientes e ON o.empresa_id = e.id
            WHERE p.id = ?
        ");
        $stmt->execute([$id]);
        $postulacion = $stmt->fetch();
        if (!$postulacion) respondError('Postulación no encontrada.', 404);

        $stmt2 = $db->prepare("
            SELECT r.id, r.respuesta_texto, pr.pregunta, pr.tipo as pregunta_tipo
            FROM respuestas_postulacion r
            JOIN preguntas_oferta pr ON r.pregunta_id = pr.id
            WHERE r.postulacion_id = ?
            ORDER BY pr.orden ASC
        ");
        $stmt2->execute([$id]);
        $postulacion['respuestas'] = $stmt2->fetchAll();

        respond(true, $postulacion);
    }

    // CAMBIAR ESTADO
    if ($method === 'POST' && $action === 'cambiar_estado') {
        $body = getBody();
        $id = $body['id'] ?? null;
        $estado = $body['estado'] ?? null;
        if (!$id || !$estado) respondError('id y estado requeridos.');
        if (!in_array($estado, ['recibido', 'revisado', 'entrevista', 'aprobado', 'rechazado']))
            respondError('Estado no válido.');

        $stmt = $db->prepare("UPDATE postulaciones_candidatos SET estado = ? WHERE id = ?");
        $stmt->execute([$estado, $id]);
        respond(true, [], 'Estado actualizado.');
    }

    // GUARDAR NOTA INTERNA
    if ($method === 'POST' && $action === 'agregar_nota') {
        $body = getBody();
        $id = $body['id'] ?? null;
        $nota = $body['nota'] ?? '';
        if (!$id) respondError('ID requerido.');

        $stmt = $db->prepare("UPDATE postulaciones_candidatos SET notas_internas = ? WHERE id = ?");
        $stmt->execute([$nota, $id]);
        respond(true, [], 'Nota guardada.');
    }
}

// ============================================================
// MÓDULO: NOTIFICACIONES
// ============================================================
if ($resource === 'notificaciones') {

    // LISTAR NOTIFICACIONES
    if ($method === 'GET' && $action === 'listar') {
        $adminId = $admin['id'];
        $stmt = $db->prepare("
            SELECT * FROM notificaciones
            WHERE usuario_id = ?
            ORDER BY created_at DESC
            LIMIT 20
        ");
        $stmt->execute([$adminId]);
        respond(true, $stmt->fetchAll());
    }

    // CONTEO DE NO LEÍDAS
    if ($method === 'GET' && $action === 'no_leidas') {
        $adminId = $admin['id'];
        $stmt = $db->prepare("SELECT COUNT(*) as total FROM notificaciones WHERE usuario_id = ? AND leida = 0");
        $stmt->execute([$adminId]);
        $row = $stmt->fetch();
        respond(true, ['total' => (int)$row['total']]);
    }

    // MARCAR COMO LEÍDA
    if ($method === 'POST' && $action === 'marcar_leida') {
        $body = getBody();
        $id = $body['id'] ?? null;
        if (!$id) respondError('ID requerido.');

        $stmt = $db->prepare("UPDATE notificaciones SET leida = 1 WHERE id = ? AND usuario_id = ?");
        $stmt->execute([$id, $admin['id']]);
        respond(true, [], 'Notificación marcada como leída.');
    }

    // MARCAR TODAS COMO LEÍDAS
    if ($method === 'POST' && $action === 'marcar_todas_leidas') {
        $stmt = $db->prepare("UPDATE notificaciones SET leida = 1 WHERE usuario_id = ? AND leida = 0");
        $stmt->execute([$admin['id']]);
        respond(true, [], 'Todas las notificaciones marcadas como leídas.');
    }
}

respondError('Recurso o acción no válida para el panel de administración.', 404);