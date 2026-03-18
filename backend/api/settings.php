<?php
// backend/api/settings.php
require_once __DIR__ . '/../middleware/cors.php';
require_once __DIR__ . '/../config/database.php';

$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $db->query("SELECT `key`, `value` FROM settings");
    $rows = $stmt->fetchAll();
    $settings = [];
    foreach ($rows as $row) {
        $settings[$row['key']] = $row['value'];
    }
    success($settings);
}

if ($method === 'POST' || $method === 'PUT') {
    $data = getJson();
    if (empty($data)) error('Нет данных');

    $stmt = $db->prepare("INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = VALUES(`value`)");
    foreach ($data as $key => $value) {
        $stmt->execute([$key, $value]);
    }
    success(['saved' => count($data)]);
}

error('Метод не поддерживается', 405);
