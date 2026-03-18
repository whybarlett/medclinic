<?php
// backend/api/doctors.php
require_once __DIR__ . '/../middleware/cors.php';
require_once __DIR__ . '/../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];
$db     = getDB();

// GET /api/doctors.php
if ($method === 'GET') {
    $id = getParam('id');

    // Один врач по ID
    if ($id) {
        $stmt = $db->prepare("
            SELECT d.*, c.name AS clinic_name, c.address AS clinic_address
            FROM doctors d
            LEFT JOIN clinics c ON c.id = d.clinic_id
            WHERE d.id = ? AND d.is_active = 1
        ");
        $stmt->execute([$id]);
        $doctor = $stmt->fetch();
        if (!$doctor) error('Врач не найден', 404);

        // Парсим JSON поля
        $doctor['specialties'] = json_decode($doctor['specialties'] ?? '[]');
        $doctor['education']   = json_decode($doctor['education']   ?? '[]');
        $doctor['awards']      = json_decode($doctor['awards']      ?? '[]');

        success($doctor);
    }

    // Список с фильтрами
    $specialty = getParam('specialty', '');
    $clinic    = getParam('clinic', '');
    $search    = getParam('name', '');
    $sort      = getParam('sort', 'rating');
    $page      = (int) getParam('page', 1);
    $limit     = (int) getParam('limit', 8);
    $offset    = ($page - 1) * $limit;

    $where  = ['d.is_active = 1'];
    $params = [];

    if ($specialty) {
        $where[]  = 'd.specialty = ?';
        $params[] = $specialty;
    }
    if ($clinic) {
        $where[]  = 'd.clinic_id = ?';
        $params[] = (int)$clinic;
    }
    if ($search) {
        $where[]  = '(d.name LIKE ? OR d.specialty LIKE ?)';
        $params[] = "%$search%";
        $params[] = "%$search%";
    }

    $orderMap = [
        'rating'     => 'd.rating DESC',
        'experience' => 'd.experience DESC',
        'price_asc'  => 'd.price ASC',
        'price_desc' => 'd.price DESC',
    ];
    $order = $orderMap[$sort] ?? 'd.rating DESC';
    $whereStr = implode(' AND ', $where);

    // Общее число
    $countStmt = $db->prepare("SELECT COUNT(*) FROM doctors d WHERE $whereStr");
    $countStmt->execute($params);
    $total = (int) $countStmt->fetchColumn();

    // Данные
    $stmt = $db->prepare("
        SELECT d.id, d.name, d.specialty, d.specialties, d.experience, d.rating,
               d.reviews_count, d.price, d.photo, d.is_available, d.next_available,
               c.name AS clinic_name, d.clinic_id
        FROM doctors d
        LEFT JOIN clinics c ON c.id = d.clinic_id
        WHERE $whereStr
        ORDER BY $order
        LIMIT $limit OFFSET $offset
    ");
    $stmt->execute($params);
    $doctors = $stmt->fetchAll();

    foreach ($doctors as &$doc) {
        $doc['specialties']    = json_decode($doc['specialties'] ?? '[]');
        $doc['is_available']   = (bool)$doc['is_available'];
        $doc['price']          = (float)$doc['price'];
        $doc['rating']         = (float)$doc['rating'];
        $doc['reviews_count']  = (int)$doc['reviews_count'];
        $doc['experience']     = (int)$doc['experience'];
    }

    success(['doctors' => $doctors, 'total' => $total, 'page' => $page, 'limit' => $limit]);
}

// POST — создать врача (только для админа)
if ($method === 'POST') {
    $data = getJson();
    if (empty($data['name']) || empty($data['specialty'])) error('Поля name и specialty обязательны');

    $stmt = $db->prepare("
        INSERT INTO doctors (clinic_id, name, specialty, specialties, experience, rating, price, photo, bio, education, awards, is_available, next_available)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([
        $data['clinic_id']    ?? 1,
        $data['name'],
        $data['specialty'],
        json_encode($data['specialties'] ?? [$data['specialty']], JSON_UNESCAPED_UNICODE),
        $data['experience']   ?? 0,
        $data['rating']       ?? 5.0,
        $data['price']        ?? 0,
        $data['photo']        ?? '',
        $data['bio']          ?? '',
        json_encode($data['education'] ?? [], JSON_UNESCAPED_UNICODE),
        json_encode($data['awards']    ?? [], JSON_UNESCAPED_UNICODE),
        isset($data['is_available']) ? (int)$data['is_available'] : 1,
        $data['next_available'] ?? date('Y-m-d'),
    ]);
    success(['id' => $db->lastInsertId()], 201);
}

// PUT — обновить врача
if ($method === 'PUT') {
    $id   = getParam('id') ?? error('ID обязателен');
    $data = getJson();

    $fields = [];
    $params = [];
    $allowed = ['name','specialty','specialties','experience','rating','price','photo','bio','education','awards','is_available','next_available','clinic_id'];

    foreach ($allowed as $f) {
        if (!isset($data[$f])) continue;
        $val = in_array($f, ['specialties','education','awards'])
            ? json_encode($data[$f], JSON_UNESCAPED_UNICODE)
            : $data[$f];
        $fields[] = "$f = ?";
        $params[] = $val;
    }
    if (empty($fields)) error('Нет полей для обновления');

    $params[] = $id;
    $stmt = $db->prepare("UPDATE doctors SET " . implode(', ', $fields) . " WHERE id = ?");
    $stmt->execute($params);
    success(['updated' => $stmt->rowCount()]);
}

// DELETE — удалить (soft delete)
if ($method === 'DELETE') {
    $id = getParam('id') ?? error('ID обязателен');
    $stmt = $db->prepare("UPDATE doctors SET is_active = 0 WHERE id = ?");
    $stmt->execute([$id]);
    success(['deleted' => true]);
}

error('Метод не поддерживается', 405);
