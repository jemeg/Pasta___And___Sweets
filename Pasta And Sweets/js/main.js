// Shopping Cart Functionality
let cart = [];

// Initialize cart manager
const cartManager = new CartManager();

// Product data
const products = [
    {
        id: 'cake-1',
        name: 'كعكة الشوكولاتة',
        price: 45.0,
        stock: 20
    },
    {
        id: 'cookies-1',
        name: 'كوكيز بالشوكولاتة',
        price: 15.0,
        stock: 50
    },
    {
        id: 'pasta-1',
        name: 'معكرونة طازجة',
        price: 25.0,
        stock: 100
    }
];

document.addEventListener('DOMContentLoaded', () => {
    // Add to Cart Buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });

    // Add to cart functionality
    document.querySelectorAll('.add-to-cart').forEach((button, index) => {
        button.addEventListener('click', () => {
            const product = products[index];
            cartManager.addItem(product);
        });
    });

    // Navigation menu functionality
    document.querySelectorAll('.nav-button').forEach(button => {
        button.addEventListener('click', function(e) {
            if (!this.classList.contains('cart')) {
                e.preventDefault();
                const href = this.getAttribute('href');
                window.location.href = href;
            }
        });
    });

    // Smooth Scrolling for Navigation
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', smoothScroll);
    });

    // Contact Form Submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }

    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinksMobile = document.querySelector('.nav-links');
    const navbar = document.querySelector('.navbar');

    mobileMenuToggle.addEventListener('click', () => {
        navLinksMobile.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinksMobile.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            navLinksMobile.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    });

    // Navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // Cart functionality
    let cartCount = 0;
    const cartCounter = document.querySelector('.cart-count');

    // Update cart count
    function updateCartCount() {
        cartCounter.textContent = cartCount;
        // Save cart count to localStorage
        localStorage.setItem('cartCount', cartCount);
        
        // Add animation class
        cartCounter.classList.add('pulse');
        setTimeout(() => {
            cartCounter.classList.remove('pulse');
        }, 300);
    }

    // Load cart count from localStorage
    window.addEventListener('load', () => {
        const savedCartCount = localStorage.getItem('cartCount');
        if (savedCartCount) {
            cartCount = parseInt(savedCartCount);
            updateCartCount();
        }
    });

    // Add to cart functionality with animation
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            cartCount++;
            updateCartCount();
            
            // Create and animate floating number
            const floatingNumber = document.createElement('span');
            floatingNumber.className = 'floating-number';
            floatingNumber.textContent = '+1';
            
            // Position the floating number at click position
            const rect = button.getBoundingClientRect();
            floatingNumber.style.left = `${e.clientX - rect.left}px`;
            floatingNumber.style.top = `${e.clientY - rect.top}px`;
            
            button.appendChild(floatingNumber);
            
            // Remove floating number after animation
            setTimeout(() => {
                floatingNumber.remove();
            }, 1000);
            
            // Button click effect
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 100);
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add hover effect to nav links
    const navItems = document.querySelectorAll('.nav-link');
    navItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            if (!item.classList.contains('active')) {
                item.style.transform = 'translateY(-2px)';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            if (!item.classList.contains('active')) {
                item.style.transform = 'translateY(0)';
            }
        });
    });

    // Form submission animation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> جاري الإرسال...';
                submitButton.disabled = true;
                
                // Simulate form submission
                setTimeout(() => {
                    submitButton.innerHTML = '<i class="fas fa-check"></i> تم الإرسال';
                    setTimeout(() => {
                        submitButton.innerHTML = submitButton.getAttribute('data-original-text') || 'إرسال';
                        submitButton.disabled = false;
                    }, 2000);
                }, 1500);
            }
        });
    });

    // User Management
    const userManager = {
        isLoggedIn() {
            return localStorage.getItem('isLoggedIn') === 'true';
        },
        getCurrentUser() {
            return JSON.parse(localStorage.getItem('currentUser'));
        },
        login(user) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', JSON.stringify(user));
        },
        logout() {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        }
    };

    // Update UI based on login state
    function updateLoginUI() {
        const loginButton = document.querySelector('a[href="login.html"]');
        if (loginButton) {
            if (userManager.isLoggedIn()) {
                const user = userManager.getCurrentUser();
                loginButton.innerHTML = `<i class="fas fa-sign-out-alt"></i> تسجيل خروج`;
                loginButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    userManager.logout();
                });
            } else {
                loginButton.innerHTML = `<i class="fas fa-user"></i> تسجيل دخول`;
            }
        }
    }

    updateLoginUI();
});

// Add to Cart Function
function addToCart(e) {
    const productCard = e.target.closest('.product-card');
    const product = {
        name: productCard.querySelector('h3').textContent,
        price: productCard.querySelector('.price').textContent,
        quantity: 1
    };

    cart.push(product);
    showNotification('تمت إضافة المنتج إلى السلة');
}

// Smooth Scrolling Function
function smoothScroll(e) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    targetSection.scrollIntoView({ behavior: 'smooth' });
}

// Form Submission Handler
function handleFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    // Here you would typically send the form data to a server
    showNotification('تم إرسال رسالتك بنجاح');
    e.target.reset();
}

// Notification Function
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
