// Sample user data (this would come from your backend in a real application)
let users = [
    { id: 1, name: "John Doe", email: "john@example.com", status: "active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", status: "inactive" }
];

// Function to render the user list in the table
function renderUserList() {
    const userTableBody = document.getElementById('user-table-body');
    userTableBody.innerHTML = ''; // Clear the table body
    
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.status}</td>
            <td>
                <button onclick="editUser(${user.id})">Edit</button>
                <button onclick="deleteUser(${user.id})">Delete</button>
            </td>
        `;
        userTableBody.appendChild(row);
    });
}

// Function to handle the form submission
document.getElementById('user-management-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const userId = document.getElementById('user-id').value;
    const userName = document.getElementById('user-name').value;
    const userEmail = document.getElementById('user-email').value;
    const userStatus = document.getElementById('user-status').value;

    if (userId) {
        // Edit existing user
        const user = users.find(user => user.id == userId);
        user.name = userName;
        user.email = userEmail;
        user.status = userStatus;
    } else {
        // Add new user
        const newUser = {
            id: users.length ? users[users.length - 1].id + 1 : 1, // Generate new ID
            name: userName,
            email: userEmail,
            status: userStatus
        };
        users.push(newUser);
    }

    // Reset form and re-render the user list
    document.getElementById('user-management-form').reset();
    document.getElementById('user-id').value = '';
    renderUserList();
});

// Function to edit a user
function editUser(userId) {
    const user = users.find(user => user.id == userId);
    document.getElementById('user-id').value = user.id;
    document.getElementById('user-name').value = user.name;
    document.getElementById('user-email').value = user.email;
    document.getElementById('user-status').value = user.status;
}

// Function to delete a user
function deleteUser(userId) {
    users = users.filter(user => user.id != userId);
    renderUserList();
}

// Initial render of the user list
renderUserList();


