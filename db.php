<?php
$host = 'localhost'; // عنوان الخادم
$dbname = 'my_website_db'; // اسم قاعدة البيانات
$username = 'root'; // اسم المستخدم (افتراضيًا root)
$password = ''; // كلمة المرور (افتراضيًا فارغة)

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("فشل الاتصال بقاعدة البيانات: " . $e->getMessage());
}
?>
