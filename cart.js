// Global variables
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize the cart page
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    initCartPage();
});

// Initialize cart page
function initCartPage() {
    if (cart.length === 0) {
        document.getElementById('cart-empty').classList.remove('d-none');
        document.getElementById('cart-items').classList.add('d-none');
    } else {
        document.getElementById('cart-empty').classList.add('d-none');
        document.getElementById('cart-items').classList.remove('d-none');
        displayCartItems();
        updateCartTotals();
    }
}

// Display cart items
function displayCartItems() {
    const container = document.getElementById('cart-products');
    container.innerHTML = '';
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="row align-items-center">
                <div class="col-md-2">
                    <img src="${item.image}" class="img-fluid" alt="${item.title}" style="max-height: 80px; object-fit: contain;">
                </div>
                <div class="col-md-4">
                    <h6 class="mb-0">${item.title}</h6>
                </div>
                <div class="col-md-2">
                    <span class="fw-bold">$${item.price.toFixed(2)}</span>
                </div>
                <div class="col-md-2">
                    <div class="d-flex align-items-center quantity-controls">
                        <button class="btn btn-outline-secondary btn-sm decrease-quantity" data-id="${item.id}">-</button>
                        <span class="mx-2 quantity-display">${item.quantity}</span>
                        <button class="btn btn-outline-secondary btn-sm increase-quantity" data-id="${item.id}">+</button>
                    </div>
                </div>
                <div class="col-md-2">
                    <span class="fw-bold">$${(item.price * item.quantity).toFixed(2)}</span>
                    <button class="btn btn-danger btn-sm ms-2 remove-item" data-id="${item.id}">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        `;
        container.appendChild(cartItem);
    });
    
    // Add event listeners to cart controls
    document.querySelectorAll('.increase-quantity').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            updateQuantity(productId, 1);
        });
    });
    
    document.querySelectorAll('.decrease-quantity').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            updateQuantity(productId, -1);
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            removeFromCart(productId);
        });
    });
}

// Update item quantity in cart
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
        updateCartTotals();
        updateCartCount();
    }
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    
    if (cart.length === 0) {
        document.getElementById('cart-empty').classList.remove('d-none');
        document.getElementById('cart-items').classList.add('d-none');
    } else {
        displayCartItems();
        updateCartTotals();
    }
    
    updateCartCount();
}

// Update cart totals
function updateCartTotals() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax + 5; // $5 shipping
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

// Update cart count in navigation
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}