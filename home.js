// Global variables
let products = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize the home page
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    initHomePage();
});

// Initialize home page
function initHomePage() {
    // Fetch products from API
    fetch('https://fakestoreapi.com/products')
        .then(response => response.json())
        .then(data => {
            products = data;
            displayProducts(products);
            document.getElementById('loading').classList.add('d-none');
        })
        .catch(error => {
            console.error('Error fetching products:', error);
            document.getElementById('loading').innerHTML = `
                <div class="alert alert-danger" role="alert">
                    Failed to load products. Please try again later.
                </div>
            `;
        });

    // Set up price range filter
    const priceRange = document.getElementById('price-range');
    const priceValue = document.getElementById('price-value');
    
    priceRange.addEventListener('input', function() {
        const maxPrice = parseInt(this.value);
        priceValue.textContent = `$0 - $${maxPrice}`;
        filterProductsByPrice(maxPrice);
    });
}

// Display products on the home page
function displayProducts(productsToDisplay) {
    const container = document.getElementById('products-container');
    container.innerHTML = '';
    
    if (productsToDisplay.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-search display-1 text-muted"></i>
                <h3 class="mt-3">No products found</h3>
                <p class="text-muted">Try adjusting your price filter</p>
            </div>
        `;
        return;
    }
    
    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'col-md-6 col-lg-4 col-xl-3';
        productCard.innerHTML = `
            <div class="card product-card h-100">
                <img src="${product.image}" class="card-img-top p-3" alt="${product.title}" style="height: 200px; object-fit: contain;">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title" style="font-size: 1rem;">${product.title.substring(0, 50)}${product.title.length > 50 ? '...' : ''}</h5>
                    <p class="card-text text-muted" style="font-size: 0.9rem;">${product.category}</p>
                    <div class="mt-auto">
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="h5 text-primary">$${product.price.toFixed(2)}</span>
                            <button class="btn btn-primary btn-sm add-to-cart" data-id="${product.id}">
                                <i class="bi bi-cart-plus"></i> Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(productCard);
    });
    
    // Add event listeners to Add to Cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

// Filter products by price
function filterProductsByPrice(maxPrice) {
    const filteredProducts = products.filter(product => product.price <= maxPrice);
    displayProducts(filteredProducts);
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    // Update localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Show success message
    showToast(`${product.title} added to cart!`);
}

// Update cart count in navigation
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Show toast notification
function showToast(message) {
    const toastContainer = document.getElementById('toast-container');
    
    const toastId = 'toast-' + Date.now();
    const toast = document.createElement('div');
    toast.id = toastId;
    toast.className = 'toast align-items-center text-bg-success border-0';
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Show the toast
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    // Remove toast from DOM after it's hidden
    toast.addEventListener('hidden.bs.toast', function() {
        toast.remove();
    });
}