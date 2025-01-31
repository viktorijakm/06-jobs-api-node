
const form = document.getElementById('loginForm');
const responseDiv = document.getElementById('response');
const accessHelloButton = document.getElementById('accessHello');
let token = '';

// Login Form Submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch('/api/v1/logon', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const data = await res.json();
        if (res.ok) {
            token = data.token; // Store the token
            responseDiv.textContent = `Login successful! Token: ${token}`;
        } else {
            responseDiv.textContent = `Error: ${data.error}`;
        }

    } catch (error) {
        console.error('Error:', error);
        responseDiv.textContent = 'An error occurred.';
    }
});

// Access Protected Route
accessHelloButton.addEventListener('click', async () => {
    if (!token) {
        responseDiv.textContent = 'Please log in first.';
        return;
    }

    try {
        const res = await fetch('/api/v1/hello', {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },

        });

        const data = await res.json();
        if (res.ok) {
            responseDiv.textContent = JSON.stringify(data, null, 2);
        } else {
            responseDiv.textContent = `Error: ${data.error}`;
        }
    } catch (error) {
        console.error('Error:', error);
        responseDiv.textContent = 'An error occurred.';
    }
});
