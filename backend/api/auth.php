<?php
// backend/api/auth.php
require_once __DIR__ . '/../middleware/cors.php';
require_once __DIR__ . '/../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];
$db     = getDB();
$action = getParam('action', 'login');

if ($method === 'POST') {
    $data = getJson();

    // Регистрация
    if ($action === 'register') {
        if (empty($data['phone']) || empty($data['password']) || empty($data['name'])) {
            error('Поля name, phone и password обязательны');
        }
        $check = $db->prepare("SELECT id FROM users WHERE phone = ?");
        $check->execute([$data['phone']]);
        if ($check->fetch()) error('Пользователь с таким телефоном уже существует');

        $hash = password_hash($data['password'], PASSWORD_BCRYPT);
        $stmt = $db->prepare("INSERT INTO users (name, phone, email, birth_date, password) VALUES (?,?,?,?,?)");
        $stmt->execute([$data['name'], $data['phone'], $data['email'] ?? '', $data['birth_date'] ?? null, $hash]);
        $userId = $db->lastInsertId();

        $user = $db->prepare("SELECT id, name, phone, email, birth_date, bonus_points FROM users WHERE id = ?");
        $user->execute([$userId]);
        success(['user' => $user->fetch(), 'token' => base64_encode("user:$userId:" . time())]);
    }

    // Вход пациента
    if ($action === 'login') {
        if (empty($data['phone']) || empty($data['password'])) error('Телефон и пароль обязательны');

        $stmt = $db->prepare("SELECT * FROM users WHERE phone = ? AND is_active = 1");
        $stmt->execute([$data['phone']]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($data['password'], $user['password'])) {
            error('Неверный телефон или пароль', 401);
        }
        unset($user['password']);
        success(['user' => $user, 'token' => base64_encode("user:{$user['id']}:" . time())]);
    }

    // Вход администратора
    if ($action === 'admin_login') {
        if (empty($data['username']) || empty($data['password'])) error('Логин и пароль обязательны');

        $stmt = $db->prepare("SELECT * FROM admins WHERE username = ? AND is_active = 1");
        $stmt->execute([$data['username']]);
        $admin = $stmt->fetch();

        if (!$admin || !password_verify($data['password'], $admin['password'])) {
            error('Неверный логин или пароль', 401);
        }
        unset($admin['password']);
        success(['admin' => $admin, 'token' => base64_encode("admin:{$admin['id']}:" . time())]);
    }
}

error('Метод не поддерживается', 405);
