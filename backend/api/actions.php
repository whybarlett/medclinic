<?php
// backend/api/actions.php
require_once __DIR__ . '/../middleware/cors.php';
require_once __DIR__ . '/../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];
$db     = getDB();

if ($method === 'GET') {
    $id = getParam('id');
    if ($id) {
        $stmt = $db->prepare("SELECT * FROM actions WHERE id = ? AND is_active = 1");
        $stmt->execute([$id]);
        $action = $stmt->fetch();
        if (!$action) error('Акция не найдена', 404);
        $action['original_price'] = (float)$action['original_price'];
        $action['discount_price'] = (float)$action['discount_price'];
        success($action);
    }
    $stmt = $db->query("SELECT * FROM actions WHERE is_active = 1 ORDER BY created_at DESC");
    $actions = $stmt->fetchAll();
    foreach ($actions as &$a) {
        $a['original_price'] = (float)$a['original_price'];
        $a['discount_price'] = (float)$a['discount_price'];
    }
    success($actions);
}

if ($method === 'POST') {
    $data = getJson();
    if (empty($data['title'])) error('Поле title обязательно');
    if ($data['original_price'] > 0 && $data['discount_price'] > 0 && empty($data['discount_percent'])) {
        $data['discount_percent'] = round((1 - $data['discount_price'] / $data['original_price']) * 100);
    }
    $stmt = $db->prepare("INSERT INTO actions (title, description, image, original_price, discount_price, discount_percent, valid_until, category_name) VALUES (?,?,?,?,?,?,?,?)");
    $stmt->execute([$data['title'], $data['description'] ?? '', $data['image'] ?? '', $data['original_price'] ?? 0, $data['discount_price'] ?? 0, $data['discount_percent'] ?? 0, $data['valid_until'] ?? date('Y-m-d', strtotime('+30 days')), $data['category_name'] ?? '']);
    success(['id' => $db->lastInsertId()], 201);
}

if ($method === 'PUT') {
    $id = getParam('id') ?? error('ID обязателен');
    $data = getJson();
    $allowed = ['title','description','image','original_price','discount_price','discount_percent','valid_until','category_name','is_active'];
    $fields = []; $params = [];
    foreach ($allowed as $f) { if (!isset($data[$f])) continue; $fields[] = "$f = ?"; $params[] = $data[$f]; }
    if (empty($fields)) error('Нет полей');
    $params[] = $id;
    $db->prepare("UPDATE actions SET " . implode(', ', $fields) . " WHERE id = ?")->execute($params);
    success(['updated' => true]);
}

if ($method === 'DELETE') {
    $id = getParam('id') ?? error('ID обязателен');
    $db->prepare("UPDATE actions SET is_active = 0 WHERE id = ?")->execute([$id]);
    success(['deleted' => true]);
}

error('Метод не поддерживается', 405);
