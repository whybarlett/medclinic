<?php
// backend/api/stats.php
require_once __DIR__ . '/../middleware/cors.php';
require_once __DIR__ . '/../config/database.php';
$db = getDB();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') error('Метод не поддерживается', 405);

$today     = date('Y-m-d');
$monthAgo  = date('Y-m-d', strtotime('-30 days'));

$totalDoctors       = (int) $db->query("SELECT COUNT(*) FROM doctors  WHERE is_active=1")->fetchColumn();
$totalClinics       = (int) $db->query("SELECT COUNT(*) FROM clinics  WHERE is_active=1")->fetchColumn();
$totalAppointments  = (int) $db->query("SELECT COUNT(*) FROM appointments")->fetchColumn();
$appointmentsToday  = (int) $db->query("SELECT COUNT(*) FROM appointments WHERE date='$today'")->fetchColumn();
$appointmentsMonth  = (int) $db->query("SELECT COUNT(*) FROM appointments WHERE date>='$monthAgo'")->fetchColumn();
$totalRevenue       = (float) $db->query("SELECT IFNULL(SUM(price),0) FROM appointments WHERE status='completed'")->fetchColumn();
$newPatients        = (int) $db->query("SELECT COUNT(*) FROM users WHERE created_at>='$monthAgo'")->fetchColumn();

// По дням за последние 7 дней
$dailyStmt = $db->query("
    SELECT date, COUNT(*) AS count, SUM(price) AS revenue
    FROM appointments
    WHERE date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    GROUP BY date ORDER BY date
");
$daily = $dailyStmt->fetchAll();

// По специальностям
$specStmt = $db->query("
    SELECT d.specialty, COUNT(*) AS count
    FROM appointments a
    JOIN doctors d ON d.id = a.doctor_id
    GROUP BY d.specialty
    ORDER BY count DESC
    LIMIT 5
");
$bySpecialty = $specStmt->fetchAll();

success([
    'total_doctors'      => $totalDoctors,
    'total_clinics'      => $totalClinics,
    'total_appointments' => $totalAppointments,
    'appointments_today' => $appointmentsToday,
    'appointments_month' => $appointmentsMonth,
    'total_revenue'      => $totalRevenue,
    'new_patients_month' => $newPatients,
    'daily'              => $daily,
    'by_specialty'       => $bySpecialty,
]);
