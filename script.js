// Завантаження товарів з JSON
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

// Відображення товарів
function displayProducts(products) {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) {
        console.error('Елемент product-grid не знайдено');
        return;
    }
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
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('add-to-cart')) {
                console.log('Клік на картку товару:', product.name);
                showModal(product);
            }
        });
        productGrid.appendChild(card);
    });

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = parseInt(e.target.dataset.id);
            const product = products.find(p => p.id === productId);
            console.log('Додано в кошик:', product.name);
            cart.push(product);
            saveCart();
        });
    });
}

// Фільтрація товарів
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

// Ініціалізація кошика
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length;
    } else {
        console.error('Елемент cart-count не знайдено');
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCartItems();
}

// Показ модального вікна для товару
function showModal(product) {
    const modal = document.getElementById('product-modal');
    if (modal) {
        console.log('Відкривається модальне вікно товару:', product.name);
        document.getElementById('modal-image').src = product.image;
        document.getElementById('modal-name').textContent = product.name;
        document.getElementById('modal-description').textContent = product.description;
        document.getElementById('modal-price').textContent = `${product.price} грн`;
        document.querySelector('.add-to-cart-modal').dataset.id = product.id;
        modal.style.display = 'flex';
    } else {
        console.error('Модальне вікно product-modal не знайдено');
    }
}

// Показ модального вікна для "Про нас"
function showAboutModal() {
    const modal = document.getElementById('about-modal');
    if (modal) {
        console.log('Відкривається модальне вікно "Про нас"');
        modal.style.display = 'flex';
    } else {
        console.error('Модальне вікно about-modal не знайдено');
    }
}

// Показ модального вікна для "Контакти"
function showContactsModal() {
    const modal = document.getElementById('contacts-modal');
    if (modal) {
        console.log('Відкривається модальне вікно "Контакти"');
        modal.style.display = 'flex';
    } else {
        console.error('Модальне вікно contacts-modal не знайдено');
    }
}

// Показ модального вікна для кошика
function showCartModal() {
    const modal = document.getElementById('cart-modal');
    if (modal) {
        console.log('Відкривається модальне вікно кошика');
        modal.style.display = 'flex';
        displayCartItems();
    } else {
        console.error('Модальне вікно cart-modal не знайдено');
    }
}

// Відображення товарів у кошику
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartEmptyMessage = document.getElementById('cart-empty');
    if (!cartItemsContainer || !cartEmptyMessage) {
        console.error('Елементи cart-items або cart-empty не знайдено');
        return;
    }

    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartEmptyMessage.style.display = 'block';
        return;
    }

    cartEmptyMessage.style.display = 'none';

    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <h4>${item.name}</h4>
            <p class="price">${item.price} грн</p>
            <button class="remove-from-cart" data-index="${index}">Видалити</button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    document.querySelectorAll('.remove-from-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            console.log('Видаляється товар із кошика:', cart[index].name);
            cart.splice(index, 1);
            saveCart();
        });
    });
}

// Ініціалізація
function init() {
    const products = loadProducts().then(products => {
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

        // Навігація
        document.getElementById('home-link').addEventListener('click', (e) => {
            e.preventDefault();
            categorySelect.value = 'all';
            minPriceInput.value = '';
            maxPriceInput.value = '';
            displayProducts(products);
        });

        document.getElementById('catalog-link').addEventListener('click', (e) => {
            e.preventDefault();
            displayProducts(products);
        });

        document.getElementById('about-link').addEventListener('click', (e) => {
            e.preventDefault();
            showAboutModal();
        });

        document.getElementById('contacts-link').addEventListener('click', (e) => {
            e.preventDefault();
            showContactsModal();
        });

        // Відкриття кошика при кліку на текст "Кошик"
        const cartIcon = document.getElementById('cart-icon');
        if (cartIcon) {
            cartIcon.addEventListener('click', () => {
                console.log('Клік на текст "Кошик"');
                showCartModal();
            });
        } else {
            console.error('Елемент cart-icon не знайдено');
        }

        // Закриття модальних вікон
        document.querySelectorAll('.close-modal').forEach(button => {
            button.addEventListener('click', () => {
                const modal = button.closest('.modal');
                console.log('Закривається модальне вікно:', modal.id);
                modal.style.display = 'none';
            });
        });

        // Додавання товару в кошик із модального вікна
        const addToCartModalBtn = document.querySelector('.add-to-cart-modal');
        if (addToCartModalBtn) {
            addToCartModalBtn.addEventListener('click', () => {
                const productId = parseInt(addToCartModalBtn.dataset.id);
                const product = products.find(p => p.id === productId);
                console.log('Додано в кошик із модального вікна:', product.name);
                cart.push(product);
                saveCart();
                document.getElementById('product-modal').style.display = 'none';
            });
        } else {
            console.error('Кнопка add-to-cart-modal не знайдена');
        }
    }).catch(error => {
        console.error('Помилка ініціалізації:', error);
    });
}

// Виклик init після завантаження DOM
document.addEventListener('DOMContentLoaded', init);