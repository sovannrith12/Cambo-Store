// dashboard.js

document.addEventListener('DOMContentLoaded', () => {
    const customerTableBody = document.querySelector('#customer-table tbody');
    const customerModal = document.getElementById('customer-modal');
    const deleteModal = document.getElementById('delete-modal');
    const customerDetails = document.getElementById('customer-details');
    const closeButton = document.querySelectorAll('.close-button');
    const confirmDeleteButton = document.getElementById('confirm-delete');
    const cancelDeleteButton = document.getElementById('cancel-delete');
    
    let customerIdToDelete = null;

    // Function to load and display customers
    async function loadCustomers() {
        try {
            const response = await fetch('/api/customers');
            if (!response.ok) throw new Error('Failed to fetch customers');
            const customers = await response.json();
            customerTableBody.innerHTML = '';
            customers.forEach(customer => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${customer.id}</td>
                    <td>${customer.name}</td>
                    <td>${customer.email}</td>
                    <td>${customer.status}</td>
                    <td><button class="btn view-btn" data-id="${customer.id}">View</button></td>
                    <td><button class="btn delete-btn" data-id="${customer.id}">Delete</button></td>
                `;
                customerTableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Load customers on page load
    loadCustomers();

    // View Customer Details
    customerTableBody.addEventListener('click', async (event) => {
        if (event.target.classList.contains('view-btn')) {
            const customerId = event.target.dataset.id;
            try {
                const response = await fetch(`/api/customers/${customerId}`);
                if (!response.ok) throw new Error('Failed to fetch customer details');
                const customer = await response.json();
                customerDetails.innerHTML = `
                    <p><strong>ID:</strong> ${customer.id}</p>
                    <p><strong>Name:</strong> ${customer.name}</p>
                    <p><strong>Email:</strong> ${customer.email}</p>
                    <p><strong>Status:</strong> ${customer.status}</p>
                `;
                customerModal.style.display = 'flex';
            } catch (error) {
                console.error('Error:', error);
            }
        }
        
        if (event.target.classList.contains('delete-btn')) {
            customerIdToDelete = event.target.dataset.id;
            deleteModal.style.display = 'flex';
        }
    });

    // Confirm Delete
    confirmDeleteButton.addEventListener('click', async () => {
        try {
            const response = await fetch(`/api/customers/${customerIdToDelete}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete customer');
            loadCustomers();
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
            customerModal.style.display = 'none';
            deleteModal.style.display = 'none';
        });
    });
});
