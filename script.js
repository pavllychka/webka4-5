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

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            const product = products.find(p => p.id === productId);
            cart.push(product);
            saveCart();
        });
    });
}

function showModal(product) {
    const modal = document.getElementById('product-modal');
    document.getElementById('modal-image').src = product.image;
    document.getElementById('modal-name').textContent = product.name;
    document.getElementById('modal-description').textContent = product.description;
    document.getElementById('modal-price').textContent = `${product.price} грн`;
    document.querySelector('.add-to-cart-modal').dataset.id = product.id;
    modal.style.display = 'flex';

    document.querySelector('.close-modal').addEventListener('click', () => {
        modal.style.display = 'none';
    });

    document.querySelector('.add-to-cart-modal').addEventListener('click', () => {
        cart.push(product);
        saveCart();
        modal.style.display = 'none';
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

    const applyFiltersBtn = document.getElementById('apply-filters');
    const categorySelect = document.getElementById('category');
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');

    function applyFilters() {
        const filteredProducts = filterProducts(products);
        displayProducts(filteredProducts);
    }

    applyFiltersBtn.addEventListener('click', applyFilters);
    categorySelect.addEventListener('change', applyFilters);
    minPriceInput.addEventListener('input', applyFilters);
    maxPriceInput.addEventListener('input', applyFilters);
}

init();