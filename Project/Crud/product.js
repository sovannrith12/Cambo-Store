let products = [];

// Load products from localStorage when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    renderProducts();
});

// Function to save products to localStorage
function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
}

// Function to load products from localStorage
function loadProducts() {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
        products = JSON.parse(storedProducts);
    }
}

// Function to render the product list
function renderProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    products.forEach((product, index) => {
        const productElement = document.createElement('div');
        productElement.classList.add('box');
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <span>$${product.price}</span>
            <button class="btn edit-btn" onclick="editProduct(${index})">Edit</button>
            <button class="btn delete-btn" onclick="deleteProduct(${index})">Delete</button>
        `;
        productList.appendChild(productElement);
    });
}

// Function to create or update a product
function createOrUpdateProduct() {
    const id = document.getElementById('product-id').value;
    const name = document.getElementById('product-name').value;
    const price = document.getElementById('product-price').value;
    const image = document.getElementById('product-image').value;

    if (!name || !price || !image) {
        alert("All fields are required!");
        return;
    }

    if (id) {
        // Update existing product
        products[id] = { name, price, image };
    } else {
        // Create new product
        products.push({ name, price, image });
    }

    // Save to localStorage and re-render product list
    saveProducts();
    resetForm();
    renderProducts();
}

// Function to delete a product
function deleteProduct(index) {
    if (index > -1 && index < products.length) {
        products.splice(index, 1);
        saveProducts();  // Save changes to localStorage
        renderProducts();
    } else {
        console.error("Invalid index for deletion:", index);
    }
}

// Function to edit a product
function editProduct(index) {
    const product = products[index];
    document.getElementById('product-id').value = index;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-image').value = product.image;
}

// Function to reset the form
function resetForm() {
    document.getElementById('product-id').value = '';
    document.getElementById('product-name').value = '';
    document.getElementById('product-price').value = '';
    document.getElementById('product-image').value = '';
}
