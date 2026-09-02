<?php
require_once __DIR__ . '/helpers/functions.php';
$db = getDB();
try {
    $stmt = $db->query("
        SELECT ubicacion COLLATE utf8mb4_unicode_ci AS ubicacion FROM empresas_clientes WHERE ubicacion IS NOT NULL AND ubicacion != ''
        UNION
        SELECT ubicacion COLLATE utf8mb4_unicode_ci AS ubicacion FROM ofertas_trabajo WHERE ubicacion IS NOT NULL AND ubicacion != ''
        ORDER BY ubicacion ASC
    ");
    print_r($stmt->fetchAll(PDO::FETCH_COLUMN));
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage();
}
