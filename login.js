// تحديد النموذج وعناصر الإدخال
const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('login-message');

// عند إرسال النموذج
loginForm.addEventListener('submit', (event) => {
    event.preventDefault(); // منع التحديث الافتراضي للصفحة

    // الحصول على القيم المدخلة
    const username = document.getElementById('username').value.trim();
    const phone = document.getElementById('phone').value.trim();

    // التحقق من صحة البيانات
    if (username === '' || phone === '') {
        alert('يرجى إدخال جميع البيانات.');
        return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
        alert('يرجى إدخال رقم هاتف صالح (10 أرقام).');
        return;
    }

    // تخزين البيانات في localStorage
    localStorage.setItem('username', username);
    localStorage.setItem('phone', phone);

    // إظهار رسالة النجاح
    loginMessage.style.display = 'block';
    loginMessage.textContent = `مرحبًا ${username}! لقد تم تسجيل دخولك بنجاح.`;

    // توجيه المستخدم إلى الصفحة الرئيسية بعد تسجيل الدخول
    setTimeout(() => {
        window.location.href = 'products.html';
    }, 2000);
});
