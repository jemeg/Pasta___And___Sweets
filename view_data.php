<?php
include 'db.php'; // تضمين ملف الاتصال

// استعلام جلب البيانات
$stmt = $conn->prepare("SELECT * FROM products");
$stmt->execute();
$products = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<h1>قائمة المنتجات</h1>
<ul>
    <?php foreach ($products as $product): ?>
        <li>
            <strong><?php echo htmlspecialchars($product['name']); ?></strong>: 
            <?php echo htmlspecialchars($product['description']); ?> - 
            <?php echo htmlspecialchars($product['price']); ?> ريال
        </li>
    <?php endforeach; ?>
</ul>
