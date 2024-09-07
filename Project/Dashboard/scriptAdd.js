// script.js

document.addEventListener('DOMContentLoaded', () => {
    const formSection = document.getElementById('product-form-section');
    const form = document.getElementById('product-form');
    const submitBtn = document.getElementById('submit-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const addProductBtn = document.getElementById('add-product-btn');
    const productsTbody = document.getElementById('products-tbody');
    let editingProductId = null;

    // Load products when the page loads
    loadProducts();

    // Show form to add a new product
    addProductBtn.addEventListener('click', () => {
        formSection.style.display = 'block';
        form.reset();
        submitBtn.textContent = 'Save Product';
        editingProductId = null;
    });

    // Hide form
    cancelBtn.addEventListener('click', () => {
        formSection.style.display = 'none';
    });

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const productData = {
            id: editingProductId,
            name: document.getElementById('product-name').value,
            description: document.getElementById('product-description').value,
            price: parseFloat(document.getElementById('product-price').value),
            image: document.getElementById('product-image').value
        };

        try {
            if (editingProductId) {
                // Update existing product
                await updateProduct(productData);
            } else {
                // Add new product
                await addProduct(productData);
            }

            formSection.style.display = 'none';
            loadProducts(); // Reload the products list
        } catch (error) {
            console.error('Error saving product:', error);
            alert('An error occurred while saving the product. Please try again.');
        }
    });

    async function loadProducts() {
        try {
            const response = await fetch('/api/products');
            if (!response.ok) throw new Error('Network response was not ok');
            const products = await response.json();
            productsTbody.innerHTML = '';

            products.forEach(product => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td>${product.description}</td>
                    <td>$${product.price.toFixed(2)}</td>
                    <td><img src="${product.image}" alt="${product.name}" width="50"></td>
                    <td>
                        <button class="btn edit-btn" data-id="${product.id}">Edit</button>
                        <button class="btn delete-btn" data-id="${product.id}">Delete</button>
                    </td>
                `;

                productsTbody.appendChild(row);
            });

            // Add event listeners for edit and delete buttons
            document.querySelectorAll('.edit-btn').forEach(button => {
                button.addEventListener('click', () => {
                    const productId = button.getAttribute('data-id');
                    editProduct(productId);
                });
            });

            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', () => {
                    const productId = button.getAttribute('data-id');
                    deleteProduct(productId);
                });
            });
        } catch (error) {
            console.error('Error loading products:', error);
            alert('An error occurred while loading the products. Please try again.');
        }
    }

    async function addProduct(productData) {
        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });
            if (!response.ok) throw new Error('Failed to add product');
        } catch (error) {
            console.error('Error adding product:', error);
            throw error; // Propagate the error to be handled by the form submission handler
        }
    }

    async function updateProduct(productData) {
        try {
            const response = await fetch(`/api/products/${productData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });
            if (!response.ok) throw new Error('Failed to update product');
        } catch (error) {
            console.error('Error updating product:', error);
            throw error; // Propagate the error to be handled by the form submission handler
        }
    }

    async function deleteProduct(productId) {
        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete product');
            loadProducts(); // Reload the products list after deletion
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('An error occurred while deleting the product. Please try again.');
        }
    }

    async function editProduct(productId) {
        try {
            const response = await fetch(`/api/products/${productId}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const product = await response.json();
            
            document.getElementById('product-id').value = product.id;
            document.getElementById('product-name').value = product.name;
            document.getElementById('product-description').value = product.description;
            document.getElementById('product-price').value = product.price;
            document.getElementById('product-image').value = product.image;

            formSection.style.display = 'block';
            submitBtn.textContent = 'Update Product';
            editingProductId = product.id;
        } catch (error) {
            console.error('Error editing product:', error);
            alert('An error occurred while loading the product details. Please try again.');
        }
    }
});
