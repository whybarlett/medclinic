<?php
// backend/api/appointments.php
require_once __DIR__ . '/../middleware/cors.php';
require_once __DIR__ . '/../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];
$db     = getDB();

if ($method === 'GET') {
    $id      = getParam('id');
    $userId  = getParam('user_id');
    $status  = getParam('status', '');
    $search  = getParam('search', '');
    $page    = (int) getParam('page', 1);
    $limit   = (int) getParam('limit', 20);
    $offset  = ($page - 1) * $limit;

    if ($id) {
        $stmt = $db->prepare("SELECT a.*, d.name AS doctor_name, d.specialty, c.name AS clinic_name FROM appointments a LEFT JOIN doctors d ON d.id=a.doctor_id LEFT JOIN clinics c ON c.id=a.clinic_id WHERE a.id=?");
        $stmt->execute([$id]);
        $apt = $stmt->fetch();
        if (!$apt) error('Запись не найдена', 404);
        $apt['price'] = (float)$apt['price'];
        success($apt);
    }

    $where = ['1=1']; $params = [];
    if ($userId) { $where[] = 'a.user_id = ?'; $params[] = $userId; }
    if ($status) { $where[] = 'a.status = ?';  $params[] = $status; }
    if ($search) {
        $where[]  = '(a.patient_name LIKE ? OR d.name LIKE ?)';
        $params[] = "%$search%";
        $params[] = "%$search%";
    }
    $whereStr = implode(' AND ', $where);

    $countStmt = $db->prepare("SELECT COUNT(*) FROM appointments a LEFT JOIN doctors d ON d.id=a.doctor_id WHERE $whereStr");
    $countStmt->execute($params);
    $total = (int) $countStmt->fetchColumn();

    $stmt = $db->prepare("
        SELECT a.id, a.date, a.time, a.status, a.price, a.patient_name, a.patient_phone, a.comment,
               d.name AS doctor_name, d.specialty AS doctor_specialty, d.photo AS doctor_photo,
               c.name AS clinic_name
        FROM appointments a
        LEFT JOIN doctors d  ON d.id = a.doctor_id
        LEFT JOIN clinics c  ON c.id = a.clinic_id
        WHERE $whereStr
        ORDER BY a.date DESC, a.time DESC
        LIMIT $limit OFFSET $offset
    ");
    $stmt->execute($params);
    $apts = $stmt->fetchAll();
    foreach ($apts as &$a) { $a['price'] = (float)$a['price']; }

    success(['appointments' => $apts, 'total' => $total]);
}

// POST — создать запись (форма записи на приём)
if ($method === 'POST') {
    $data = getJson();
    $required = ['doctor_id', 'clinic_id', 'date', 'time', 'patient_name', 'patient_phone'];
    foreach ($required as $r) {
        if (empty($data[$r])) error("Поле $r обязательно");
    }

    // Проверим что слот не занят
    $slotCheck = $db->prepare("SELECT id FROM appointments WHERE doctor_id=? AND date=? AND time=? AND status != 'cancelled'");
    $slotCheck->execute([$data['doctor_id'], $data['date'], $data['time']]);
    if ($slotCheck->fetch()) error('Этот слот уже занят, выберите другое время');

    // Получаем цену
    $priceStmt = $db->prepare("SELECT price FROM doctors WHERE id = ?");
    $priceStmt->execute([$data['doctor_id']]);
    $price = $data['price'] ?? ($priceStmt->fetchColumn() ?: 0);

    $stmt = $db->prepare("
        INSERT INTO appointments (user_id, doctor_id, service_id, clinic_id, date, time, price, patient_name, patient_phone, patient_email, comment)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([
        $data['user_id']       ?? null,
        $data['doctor_id'],
        $data['service_id']    ?? null,
        $data['clinic_id'],
        $data['date'],
        $data['time'],
        $price,
        $data['patient_name'],
        $data['patient_phone'],
        $data['patient_email'] ?? '',
        $data['comment']       ?? '',
    ]);

    $newId = $db->lastInsertId();
    success(['id' => $newId, 'message' => 'Запись успешно создана'], 201);
}

// PUT — обновить статус
if ($method === 'PUT') {
    $id   = getParam('id') ?? error('ID обязателен');
    $data = getJson();
    $allowed = ['status', 'comment', 'date', 'time'];
    $fields = []; $params = [];
    foreach ($allowed as $f) {
        if (!isset($data[$f])) continue;
        $fields[] = "$f = ?";
        $params[] = $data[$f];
    }
    if (empty($fields)) error('Нет полей для обновления');
    $params[] = $id;
    $db->prepare("UPDATE appointments SET " . implode(', ', $fields) . " WHERE id = ?")->execute($params);
    success(['updated' => true]);
}

error('Метод не поддерживается', 405);
