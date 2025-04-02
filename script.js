
async function loadProducts() {
    try {
        const response = await fetch('products.json');
        const products = await response.json();
        return products;
    } catch (error) {
        console.error('Помилка завантаження товарів:', error);
        return [];
    }
}


function displayProducts(products) {
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = '';

    if (products.length === 0) {
        productGrid.innerHTML = '<p>Товари не знайдено</p>';
        return;
    }

    products.forEach(product => {
        const card = document.createElement('article');
        card.classList.add('product-card');
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p class="price">${product.price} грн</p>
            <button class="add-to-cart" data-id="${product.id}">Додати в кошик</button>
        `;
        productGrid.appendChild(card);
    });
}


function filterProducts(products) {
    const category = document.getElementById('category').value;
    const minPrice = parseInt(document.getElementById('min-price').value) || 0;
    const maxPrice = parseInt(document.getElementById('max-price').value) || Infinity;

    return products.filter(product => {
        const matchesCategory = category === 'all' || product.category === category;
        const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
        return matchesCategory && matchesPrice;
    });
}


async function init() {
    const products = await loadProducts();
    displayProducts(products);

    
    document.getElementById('apply-filters').addEventListener('click', () => {
        const filteredProducts = filterProducts(products);
        displayProducts(filteredProducts);
    });
}

init();

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    cartCount.textContent = cart.length;
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

async function init() {
    const products = await loadProducts();
    displayProducts(products);
    updateCartCount(); 

    document.getElementById('apply-filters').addEventListener('click', () => {
        const filteredProducts = filterProducts(products);
        displayProducts(filteredProducts);
    });
}

init();