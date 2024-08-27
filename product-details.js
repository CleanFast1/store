let iconCart = document.querySelector('.iconCart');
let cart = document.querySelector('.cart');
let container = document.querySelector('.container');
let close = document.querySelector('.close');
let productDetails = document.querySelector('.product-details');
let listCart = [];
let products = [];

// Function to update the cart display
function updateCartDisplay() {
    let listCartHTML = document.querySelector('.listCart');
    listCartHTML.innerHTML = '';

    let totalHTML = document.querySelector('.totalQuantity');
    let totalQuantity = 0;

    listCart.forEach(product => {
        if (product) {
            let newCart = document.createElement('div');
            newCart.classList.add('item');
            newCart.innerHTML = `
                <img src="${product.image}">
                <div class="content">
                    <div class="name">${product.name}</div>
                    <div class="price">$${product.price} / ${product.quantity} product(s)</div>
                </div>
                <div class="quantity">
                    <button onclick="changeQuantity(${product.id}, '-')">-</button>
                    <span class="value">${product.quantity}</span>
                    <button onclick="changeQuantity(${product.id}, '+')">+</button>
                </div>`;
            listCartHTML.appendChild(newCart);
            totalQuantity += product.quantity;
        }
    });
    totalHTML.innerText = totalQuantity;
}

// Updated Function to add a product to the cart
function addCart(productId) {
    let product = products.find(p => p.id == productId);

    if (product) {
        let existingProduct = listCart.find(p => p.id === productId);
        if (existingProduct) {
            // Update quantity if the product is already in the cart
            existingProduct.quantity++;
        } else {
            // Add the product to the cart if it's not already present
            product.quantity = 1;
            listCart.push(product);
        }
        document.cookie = "listCart=" + JSON.stringify(listCart) + "; expires=Thu, 31 Dec 2025 23:59:59 UTC; path=/;";
        updateCartDisplay();
    }
}

// Function to change the quantity of a product
function changeQuantity(productId, type) {
    let product = listCart.find(p => p.id === productId);
    if (product) {
        switch (type) {
            case '+':
                product.quantity++;
                break;
            case '-':
                product.quantity--;
                if (product.quantity <= 0) {
                    listCart = listCart.filter(p => p.id !== productId);
                }
                break;
            default:
                break;
        }
        document.cookie = "listCart=" + JSON.stringify(listCart) + "; expires=Thu, 31 Dec 2025 23:59:59 UTC; path=/;";
        updateCartDisplay();
    }
}

// Function to fetch and display product details
function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    fetch('product.json')
        .then(response => response.json())
        .then(data => {
            products = data; // Store products globally
            const product = products.find(p => p.id == productId);
            if (product) {
                document.getElementById('mainImage').src = product.image;
                document.getElementById('productName').textContent = product.name;
                document.getElementById('productPrice').textContent = `$${product.price}`;
                document.getElementById('productDescription').textContent = product.description;
                document.getElementById('addToCartButton').onclick = () => addCart(productId);
                document.getElementById('buyNowButton').onclick = () => {
                    addCart(productId);
                    window.location.href = 'checkout.html';
                };

                // Add thumbnails
                const thumbnailsContainer = document.querySelector('.thumbnails');
                thumbnailsContainer.innerHTML = ''; // Clear existing thumbnails
                product.images.forEach((imgSrc, index) => {
                    let thumbnail = document.createElement('img');
                    thumbnail.src = imgSrc;
                    thumbnail.alt = `Thumbnail ${index + 1}`;
                    thumbnail.onclick = () => document.getElementById('mainImage').src = imgSrc;
                    thumbnailsContainer.appendChild(thumbnail);
                });
            } else {
                productDetails.innerHTML = '<p>Product not found.</p>';
            }
            updateCartDisplay();
        });
}

// Cart icon functionality
iconCart.addEventListener('click', function() {
    if(cart.style.right == '-100%'){
        cart.style.right = '0';
        container.style.transform = 'translateX(-400px)';
    } else {
        cart.style.right = '-100%';
        container.style.transform = 'translateX(0)';
    }
});

close.addEventListener('click', function (){
    cart.style.right = '-100%';
    container.style.transform = 'translateX(0)';
});

// Function to clear the cart and cookies
function clearCart() {
    document.cookie = "listCart=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
    listCart = [];
    updateCartDisplay();
}

// Initialize cart and load product details
function initialize() {
    clearCart(); // Clear cart on page load
    loadProductDetails();
}

initialize();
