<?php
// backend/api/reviews.php
require_once __DIR__ . '/../middleware/cors.php';
require_once __DIR__ . '/../config/database.php';
$db = getDB();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $doctorId = getParam('doctor_id');
    $clinicId = getParam('clinic_id');
    $where = ['r.is_published = 1']; $params = [];
    if ($doctorId) { $where[] = 'r.doctor_id = ?'; $params[] = $doctorId; }
    if ($clinicId) { $where[] = 'r.clinic_id = ?'; $params[] = $clinicId; }
    $whereStr = implode(' AND ', $where);
    $stmt = $db->prepare("SELECT * FROM reviews WHERE $whereStr ORDER BY created_at DESC LIMIT 20");
    $stmt->execute($params);
    $reviews = $stmt->fetchAll();
    foreach ($reviews as &$r) { $r['rating'] = (int)$r['rating']; }
    success($reviews);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = getJson();
    if (empty($data['author_name']) || empty($data['text']) || empty($data['rating'])) error('Обязательные поля: author_name, text, rating');
    $stmt = $db->prepare("INSERT INTO reviews (author_name, doctor_id, clinic_id, rating, text) VALUES (?,?,?,?,?)");
    $stmt->execute([$data['author_name'], $data['doctor_id'] ?? null, $data['clinic_id'] ?? null, min(5, max(1, (int)$data['rating'])), $data['text']]);
    success(['id' => $db->lastInsertId()], 201);
}
error('Метод не поддерживается', 405);
