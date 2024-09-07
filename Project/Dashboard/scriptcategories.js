// dashboard.js

document.addEventListener('DOMContentLoaded', () => {
    const categoryTableBody = document.querySelector('#category-table tbody');
    const categoryModal = document.getElementById('category-modal');
    const deleteModal = document.getElementById('delete-modal');
    const categoryForm = document.getElementById('category-form');
    const categoryNameInput = document.getElementById('category-name');
    const categoryIdInput = document.getElementById('category-id');
    const closeButton = document.querySelectorAll('.close-button');
    const addCategoryButton = document.getElementById('add-category-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const confirmDeleteButton = document.getElementById('confirm-delete');
    const cancelDeleteButton = document.getElementById('cancel-delete');
    
    let categoryIdToDelete = null;
    let categoryToEdit = null;

    // Load and display categories
    async function loadCategories() {
        try {
            const response = await fetch('/api/categories');
            if (!response.ok) throw new Error('Failed to fetch categories');
            const categories = await response.json();
            categoryTableBody.innerHTML = '';
            categories.forEach(category => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${category.id}</td>
                    <td>${category.name}</td>
                    <td>
                        <button class="btn edit-btn" data-id="${category.id}">Edit</button>
                        <button class="btn delete-btn" data-id="${category.id}">Delete</button>
                    </td>
                `;
                categoryTableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Load categories on page load
    loadCategories();

    // Show Add/Edit Category Modal
    addCategoryButton.addEventListener('click', () => {
        categoryModal.style.display = 'flex';
        document.getElementById('modal-title').textContent = 'Add Category';
        categoryForm.reset();
        categoryIdInput.value = '';
        categoryToEdit = null;
    });

    // Edit Category
    categoryTableBody.addEventListener('click', (event) => {
        if (event.target.classList.contains('edit-btn')) {
            const categoryId = event.target.dataset.id;
            fetch(`/api/categories/${categoryId}`)
                .then(response => response.json())
                .then(category => {
                    categoryNameInput.value = category.name;
                    categoryIdInput.value = category.id;
                    categoryModal.style.display = 'flex';
                    document.getElementById('modal-title').textContent = 'Edit Category';
                    categoryToEdit = category;
                })
                .catch(error => console.error('Error:', error));
        }

        if (event.target.classList.contains('delete-btn')) {
            categoryIdToDelete = event.target.dataset.id;
            deleteModal.style.display = 'flex';
        }
    });

    // Handle Add/Edit Category Form Submission
    categoryForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const categoryName = categoryNameInput.value;
        const categoryId = categoryIdInput.value;

        try {
            const method = categoryToEdit ? 'PUT' : 'POST';
            const url = categoryToEdit ? `/api/categories/${categoryId}` : '/api/categories';
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: categoryName })
            });
            if (!response.ok) throw new Error('Failed to save category');
            loadCategories();
            categoryModal.style.display = 'none';
        } catch (error) {
            console.error('Error:', error);
        }
    });

    // Confirm Delete
    confirmDeleteButton.addEventListener('click', async () => {
        try {
            const response = await fetch(`/api/categories/${categoryIdToDelete}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete category');
            loadCategories();
            deleteModal.style.display = 'none';
        } catch (error) {
            console.error('Error:', error);
        }
    });

    // Cancel Delete
    cancelDeleteButton.addEventListener('click', () => {
        deleteModal.style.display = 'none';
    });

    // Close Modals
    closeButton.forEach(button => {
        button.addEventListener('click', () => {
            categoryModal.style.display = 'none';
            deleteModal.style.display = 'none';
        });
    });

    // Cancel Add/Edit Category
    cancelBtn.addEventListener('click', () => {
        categoryModal.style.display = 'none';
    });
});
