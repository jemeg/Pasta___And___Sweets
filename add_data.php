<?php
include 'db.php'; // تضمين ملف الاتصال

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // جلب البيانات من النموذج
    $name = $_POST['name'];
    $description = $_POST['description'];
    $price = $_POST['price'];

    // إدخال البيانات في قاعدة البيانات
    $stmt = $conn->prepare("INSERT INTO products (name, description, price) VALUES (:name, :description, :price)");
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':description', $description);
    $stmt->bindParam(':price', $price);

    if ($stmt->execute()) {
        echo "تم إضافة المنتج بنجاح!";
    } else {
        echo "فشل في إضافة المنتج.";
    }
}
?>
