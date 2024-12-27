document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in
    if (userManager.isLoggedIn() && window.location.pathname.includes('login.html')) {
        window.location.href = 'index.html';
    }

    // Tab Switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const authForms = document.querySelectorAll('.auth-form');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and forms
            tabBtns.forEach(b => b.classList.remove('active'));
            authForms.forEach(f => f.classList.remove('active'));

            // Add active class to clicked button and corresponding form
            btn.classList.add('active');
            const formId = `${btn.dataset.tab}-form`;
            document.getElementById(formId).classList.add('active');
        });
    });

    // Login Form Handling
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const phone = document.getElementById('login-phone').value;
        const password = document.getElementById('login-password').value;

        if (validateLoginForm(phone, password)) {
            try {
                const user = userManager.loginUser(phone, password);
                showNotification('تم تسجيل الدخول بنجاح');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } catch (error) {
                showError('login-phone', error.message);
            }
        }
    });

    // Register Form Handling
    const registerForm = document.getElementById('register-form');
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('register-name').value;
        const phone = document.getElementById('register-phone').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;

        if (validateRegisterForm(name, phone, email, password, confirmPassword)) {
            try {
                const user = userManager.registerUser(name, phone, email, password);
                showNotification('تم إنشاء الحساب بنجاح');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } catch (error) {
                showError('register-phone', error.message);
            }
        }
    });
});

// Form Validation Functions
function validateLoginForm(phone, password) {
    let isValid = true;

    // Phone validation
    if (!phone.match(/^[0-9]{10}$/)) {
        showError('login-phone', 'يرجى إدخال رقم هاتف صحيح');
        isValid = false;
    } else {
        clearError('login-phone');
    }

    // Password validation
    if (password.length < 6) {
        showError('login-password', 'كلمة المرور يجب أن تكون 6 أحرف على الأقل');
        isValid = false;
    } else {
        clearError('login-password');
    }

    return isValid;
}

function validateRegisterForm(name, phone, email, password, confirmPassword) {
    let isValid = true;

    // Name validation
    if (name.length < 2) {
        showError('register-name', 'يرجى إدخال اسم صحيح');
        isValid = false;
    } else {
        clearError('register-name');
    }

    // Phone validation
    if (!phone.match(/^[0-9]{10}$/)) {
        showError('register-phone', 'يرجى إدخال رقم هاتف صحيح');
        isValid = false;
    } else {
        clearError('register-phone');
    }

    // Email validation
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        showError('register-email', 'يرجى إدخال بريد إلكتروني صحيح');
        isValid = false;
    } else {
        clearError('register-email');
    }

    // Password validation
    if (password.length < 6) {
        showError('register-password', 'كلمة المرور يجب أن تكون 6 أحرف على الأقل');
        isValid = false;
    } else {
        clearError('register-password');
    }

    // Confirm password validation
    if (password !== confirmPassword) {
        showError('register-confirm-password', 'كلمة المرور غير متطابقة');
        isValid = false;
    } else {
        clearError('register-confirm-password');
    }

    return isValid;
}

// Helper Functions
function showError(inputId, message) {
    const formGroup = document.getElementById(inputId).closest('.form-group');
    formGroup.classList.add('error');
    
    let errorDiv = formGroup.querySelector('.error-message');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        formGroup.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
}

function clearError(inputId) {
    const formGroup = document.getElementById(inputId).closest('.form-group');
    formGroup.classList.remove('error');
    const errorDiv = formGroup.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Style the notification
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#e74c3c';
    notification.style.color = 'white';
    notification.style.padding = '1rem';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '1000';
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
