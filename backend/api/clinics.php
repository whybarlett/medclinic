<?php
// backend/api/clinics.php
require_once __DIR__ . '/../middleware/cors.php';
require_once __DIR__ . '/../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];
$db     = getDB();

if ($method === 'GET') {
    $id = getParam('id');

    if ($id) {
        $stmt = $db->prepare("SELECT * FROM clinics WHERE id = ? AND is_active = 1");
        $stmt->execute([$id]);
        $clinic = $stmt->fetch();
        if (!$clinic) error('Клиника не найдена', 404);
        $clinic['working_hours'] = json_decode($clinic['working_hours'] ?? '{}', true);
        $clinic['lat'] = (float)$clinic['lat'];
        $clinic['lng'] = (float)$clinic['lng'];
        $clinic['rating'] = (float)$clinic['rating'];
        success($clinic);
    }

    $region = getParam('region', 1);
    $stmt = $db->prepare("SELECT * FROM clinics WHERE is_active = 1 AND region_id = ? ORDER BY id");
    $stmt->execute([$region]);
    $clinics = $stmt->fetchAll();
    foreach ($clinics as &$c) {
        $c['working_hours'] = json_decode($c['working_hours'] ?? '{}', true);
        $c['coordinates']   = [(float)$c['lat'], (float)$c['lng']];
        $c['rating']        = (float)$c['rating'];
        $c['reviews_count'] = (int)$c['reviews_count'];
    }
    success($clinics);
}

if ($method === 'POST') {
    $data = getJson();
    if (empty($data['name'])) error('Поле name обязательно');
    $stmt = $db->prepare("INSERT INTO clinics (region_id, name, address, city, phone, email, metro, lat, lng, photo, rating, reviews_count, working_hours) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)");
    $stmt->execute([
        $data['region_id']     ?? 1,
        $data['name'],
        $data['address']       ?? '',
        $data['city']          ?? 'Томск',
        $data['phone']         ?? '',
        $data['email']         ?? '',
        $data['metro']         ?? '',
        $data['lat']           ?? 56.4884,
        $data['lng']           ?? 84.9525,
        $data['photo']         ?? '',
        $data['rating']        ?? 5.0,
        $data['reviews_count'] ?? 0,
        json_encode($data['working_hours'] ?? ['Пн–Пт' => '8:00–22:00'], JSON_UNESCAPED_UNICODE),
    ]);
    success(['id' => $db->lastInsertId()], 201);
}

if ($method === 'PUT') {
    $id   = getParam('id') ?? error('ID обязателен');
    $data = getJson();
    $allowed = ['name','address','city','phone','email','metro','lat','lng','photo','rating','working_hours','is_active'];
    $fields = []; $params = [];
    foreach ($allowed as $f) {
        if (!isset($data[$f])) continue;
        $fields[] = "$f = ?";
        $params[] = $f === 'working_hours' ? json_encode($data[$f], JSON_UNESCAPED_UNICODE) : $data[$f];
    }
    if (empty($fields)) error('Нет полей для обновления');
    $params[] = $id;
    $db->prepare("UPDATE clinics SET " . implode(', ', $fields) . " WHERE id = ?")->execute($params);
    success(['updated' => true]);
}

if ($method === 'DELETE') {
    $id = getParam('id') ?? error('ID обязателен');
    $db->prepare("UPDATE clinics SET is_active = 0 WHERE id = ?")->execute([$id]);
    success(['deleted' => true]);
}

error('Метод не поддерживается', 405);
