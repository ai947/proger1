// Data for the cart
let cart = JSON.parse(localStorage.getItem('cart')) || []; // Load from localStorage or initialize empty
let total = 0;

// Function to add product to cart
function addToCart(productName, productPrice, productImage) {
    const existingProductIndex = cart.findIndex(item => item.name === productName);
    
    if (existingProductIndex !== -1) {
        // If the product already exists, increase the quantity
        cart[existingProductIndex].quantity += 1;
    } else {
        // If it's a new product, add it to the cart
        const item = {
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
        };
        cart.push(item);
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

// Function to update the cart count
function updateCartCount() {
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
    document.getElementById('cart-count').textContent = cartCount;
}

// Function to render the cart
function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = ''; // Clear previous items
    total = 0; // Reset total
    
    cart.forEach((item, index) => {
        cartItemsContainer.innerHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <span>${item.name}</span>
                <div class="quantity-controls">
                    <button class="btn btn-sm btn-secondary" onclick="updateQuantity(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="btn btn-sm btn-secondary" onclick="updateQuantity(${index}, 1)">+</button>
                </div>
                <span>${(item.price * item.quantity).toFixed(2)} DH</span>
                <button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">إزالة</button>
            </div>
        `;
        total += item.price * item.quantity;
    });
    
    document.getElementById('cart-total').innerText = total.toFixed(2) + ' DH';
}

// Function to update quantity
function updateQuantity(index, change) {
    if (cart[index].quantity + change > 0) {
        cart[index].quantity += change;
        localStorage.setItem('cart', JSON.stringify(cart)); // Update cart in localStorage
        updateCartCount();
        renderCart();
    }
}

// Function to remove item from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart)); // Update cart in localStorage
    updateCartCount();
    renderCart();
}

// Function to confirm order and redirect to checkout page
function confirmOrder() {
    window.location.href = 'checkout.html'; // Redirect to checkout page
}

// Add click event listeners to add-to-cart buttons
document.querySelectorAll('.add-to-cart').forEach((button) => {
    button.addEventListener('click', () => {
        const productCard = button.parentElement;
        const productName = productCard.querySelector('h5').innerText;
        const productPrice = parseFloat(productCard.querySelector('p').innerText.replace('السعر: ', '').replace(' DH', ''));
        const productImage = productCard.querySelector('img').src;
        addToCart(productName, productPrice, productImage);
    });
});

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    renderCart();
});

// Function to toggle cart visibility
function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    sidebar.classList.toggle('active');
}
