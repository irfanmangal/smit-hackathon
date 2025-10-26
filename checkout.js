// Global variables
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize the checkout page
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    initCheckoutPage();
});

// Initialize checkout page
function initCheckoutPage() {
    if (cart.length === 0) {
        // Redirect to home if cart is empty
        window.location.href = 'home.html';
        return;
    }
    
    displayCheckoutItems();
    updateCheckoutTotals();
    
    // Set up checkout form submission
    document.getElementById('checkout-form').addEventListener('submit', function(e) {
        e.preventDefault();
        processOrder();
    });
}

// Display items on checkout page
function displayCheckoutItems() {
    const container = document.getElementById('checkout-products');
    container.innerHTML = '';
    
    cart.forEach(item => {
        const checkoutItem = document.createElement('div');
        checkoutItem.className = 'd-flex justify-content-between mb-2';
        checkoutItem.innerHTML = `
            <div>
                <h6 class="mb-0">${item.title}</h6>
                <small class="text-muted">Qty: ${item.quantity}</small>
            </div>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        `;
        container.appendChild(checkoutItem);
    });
}

// Update checkout totals
function updateCheckoutTotals() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax + 5; // $5 shipping
    
    document.getElementById('checkout-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('checkout-tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('checkout-total').textContent = `$${total.toFixed(2)}`;
}

// Process order
function processOrder() {
    // In a real application, you would send the order data to a server here
    
    // Show success modal
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.show();
    
    // Clear cart after successful order
    localStorage.removeItem('cart');
    cart = [];
    updateCartCount();
    
    // Set up continue shopping button
    document.getElementById('continue-shopping').addEventListener('click', function() {
        window.location.href = 'home.html';
    });
}

// Update cart count in navigation
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}