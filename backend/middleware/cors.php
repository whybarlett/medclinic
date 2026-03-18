<?php
// backend/middleware/cors.php

// Разрешаем запросы с Vue dev сервера
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5186', 'http://127.0.0.1:5173'];

if (in_array($origin, $allowed) || str_starts_with($origin, 'http://localhost:') || str_starts_with($origin, 'http://127.0.0.1:')) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header("Access-Control-Allow-Origin: http://localhost:5173");
}

header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=utf-8');

// Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ─── Хелперы ответов ───────────────────────────────────────

function success(mixed $data, int $code = 200): never {
    http_response_code($code);
    echo json_encode(['success' => true, 'data' => $data], JSON_UNESCAPED_UNICODE);
    exit();
}

function error(string $message, int $code = 400): never {
    http_response_code($code);
    echo json_encode(['success' => false, 'error' => $message], JSON_UNESCAPED_UNICODE);
    exit();
}

function getJson(): array {
    $body = file_get_contents('php://input');
    return json_decode($body, true) ?? [];
}

function getParam(string $key, mixed $default = null): mixed {
    return $_GET[$key] ?? $default;
}

function requireParam(string $key): mixed {
    $val = $_GET[$key] ?? null;
    if ($val === null) error("Параметр '$key' обязателен");
    return $val;
}
