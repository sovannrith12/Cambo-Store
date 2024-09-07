// dashboard.js

document.addEventListener('DOMContentLoaded', () => {
    // Fetch and display orders
    async function loadOrders() {
        try {
            const response = await fetch('/api/orders');
            if (!response.ok) throw new Error('Failed to fetch orders');
            const orders = await response.json();
            const orderTableBody = document.querySelector('#order-table tbody');
            orderTableBody.innerHTML = '';
            orders.forEach(order => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${order.id}</td>
                    <td>${order.customerName}</td>
                    <td>$${order.totalAmount}</td>
                    <td>${order.status}</td>
                    <td>
                        <button class="btn view-details" data-id="${order.id}">View</button>
                        <button class="btn update-status" data-id="${order.id}">Update Status</button>
                    </td>
                `;
                orderTableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Load orders when the page loads
    loadOrders();

    // Handle view details
    document.querySelector('#order-table').addEventListener('click', async (event) => {
        if (event.target.classList.contains('view-details')) {
            const orderId = event.target.getAttribute('data-id');
            try {
                const response = await fetch(`/api/orders/${orderId}`);
                if (!response.ok) throw new Error('Failed to fetch order details');
                const order = await response.json();
                const orderDetailsDiv = document.getElementById('order-details');
                orderDetailsDiv.innerHTML = `
                    <p><strong>Order ID:</strong> ${order.id}</p>
                    <p><strong>Customer Name:</strong> ${order.customerName}</p>
                    <p><strong>Total Amount:</strong> $${order.totalAmount}</p>
                    <p><strong>Status:</strong> ${order.status}</p>
                    <p><strong>Items:</strong></p>
                    <ul>
                        ${order.items.map(item => `<li>${item.name} (${item.quantity} x $${item.price})</li>`).join('')}
                    </ul>
                `;
                document.getElementById('order-details-modal').style.display = 'flex';
            } catch (error) {
                console.error('Error:', error);
            }
        }

        // Handle close of the modal
        if (event.target.classList.contains('close-button')) {
            document.getElementById('order-details-modal').style.display = 'none';
        }
    });

    // Handle update status
    document.querySelector('#order-table').addEventListener('click', async (event) => {
        if (event.target.classList.contains('update-status')) {
            const orderId = event.target.getAttribute('data-id');
            const newStatus = prompt('Enter new status (e.g., shipped, completed):');
            if (!newStatus) return;

            try {
                const response = await fetch(`/api/orders/${orderId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: newStatus })
                });
                if (!response.ok) throw new Error('Failed to update order status');
                // Reload orders to reflect changes
                loadOrders();
            } catch (error) {
                console.error('Error:', error);
            }
        }
    });
});
