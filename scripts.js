let cart = [];
let cartCount = 0;

function addToCart(productName, price) {
    // إضافة المنتج إلى السلة
    cart.push({ name: productName, price: price });
    cartCount++;
    updateCartUI();
    alert(`تمت إضافة ${productName} إلى السلة!`);
}

function updateCartUI() {
    // تحديث عداد السلة
    document.getElementById('cart-count').innerText = cartCount;

    // تحديث قائمة السلة
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = ''; // مسح العناصر السابقة
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        const itemDiv = document.createElement('div');
        itemDiv.innerHTML = `
            <p>${item.name} - ${item.price} دينار <button onclick="removeFromCart(${index})">إزالة</button></p>
        `;
        cartItemsContainer.appendChild(itemDiv);
    });

    // تحديث الإجمالي
    document.getElementById('cart-total').innerText = `الإجمالي: ${total} دينار`;
}

function removeFromCart(index) {
    // إزالة عنصر من السلة
    cartCount--;
    cart.splice(index, 1);
    updateCartUI();
}

function toggleCart() {
    // إظهار أو إخفاء السلة
    const cart = document.getElementById('cart');
    cart.style.display = cart.style.display === 'none' || cart.style.display === '' ? 'block' : 'none';
}

function checkout() {
    if (cart.length === 0) {
        alert('سلتك فارغة!');
        return;
    }
    alert('شكراً لشرائك! سيتم توصيل الطلب قريباً.');
    cart = [];
    cartCount = 0;
    updateCartUI();
}
