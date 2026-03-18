<?php
// backend/api/services.php
require_once __DIR__ . '/../middleware/cors.php';
require_once __DIR__ . '/../config/database.php';

$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $cat = getParam('category', '');
    $id  = getParam('id');

    if ($id) {
        $stmt = $db->prepare("SELECT s.*, sc.name AS category_name FROM services s LEFT JOIN service_categories sc ON sc.id = s.category_id WHERE s.id = ?");
        $stmt->execute([$id]);
        $s = $stmt->fetch();
        if (!$s) error('Услуга не найдена', 404);
        success($s);
    }

    // Категории + количество услуг
    if (getParam('type') === 'categories') {
        $stmt = $db->query("SELECT * FROM service_categories WHERE is_active = 1 ORDER BY sort_order");
        success($stmt->fetchAll());
    }

    $where = ['s.is_active = 1']; $params = [];
    if ($cat) {
        $where[]  = 'sc.slug = ?';
        $params[] = $cat;
    }
    $whereStr = implode(' AND ', $where);
    $stmt = $db->prepare("SELECT s.*, sc.name AS category_name, sc.slug AS category_slug FROM services s LEFT JOIN service_categories sc ON sc.id = s.category_id WHERE $whereStr ORDER BY s.is_popular DESC, s.name");
    $stmt->execute($params);
    $services = $stmt->fetchAll();
    foreach ($services as &$s) { $s['price'] = (float)$s['price']; $s['is_popular'] = (bool)$s['is_popular']; }
    success($services);
}

error('Метод не поддерживается', 405);
