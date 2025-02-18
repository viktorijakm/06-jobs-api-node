const formLogin = document.getElementById('loginForm');
const formRegister = document.getElementById('registerForm');
const loginResponse = document.getElementById('loginResponse');
const registerResponse = document.getElementById('registerResponse');
const goToRegisterButton = document.getElementById('goToRegister');
const goToLoginButton = document.getElementById('goToLogin');
const loginFormDiv = document.getElementById('loginFormDiv');
const registerFormDiv = document.getElementById('registerFormDiv');
const accessHelloButton = document.getElementById('accessHello');
const responseDiv = document.getElementById('responseDiv');
let token = localStorage.getItem('token') || ''; // Get token from local storage if available

// Toggle between Login and Register Forms
goToRegisterButton.addEventListener('click', () => {
    loginFormDiv.style.display = 'none';
    registerFormDiv.style.display = 'block';
});
  
goToLoginButton.addEventListener('click', () => {
    registerFormDiv.style.display = 'none';
    loginFormDiv.style.display = 'block';
});

// Check if already logged in
if (token) {
    window.location.href = 'expenses.html'; // If token exists, redirect to expenses page
}

// Login Form Submission
formLogin.addEventListener('submit', async (e) => {
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
            localStorage.setItem('token', token); // Store token in localStorage
            loginResponse.textContent = 'Login successful!';

        // Delay before redirecting to give time for login success message
        setTimeout(() => {
            window.location.href = 'expenses.html'; // Redirect to expenses page
        }, 500);
        
        } else {
            loginResponse.textContent = `Error: ${data.error}`;
        }

    } catch (error) {
        console.error('Error:', error);
        loginResponse.textContent = 'An error occurred.';
    }
});

// Register Form Submission
formRegister.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;

    // Check if passwords match
    if (password !== passwordConfirm) {
        registerResponse.textContent = 'Passwords do not match.';
        return;
    }

    try {
        const res = await fetch('/api/v1/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, username, password }),
        });

        const data = await res.json();
        if (res.ok) {
            registerResponse.textContent = 'Registration successful! You can now log in.';
        } else {
            registerResponse.textContent = `Error: ${data.error}`;
        }
    } catch (error) {
        console.error('Error:', error);
        registerResponse.textContent = 'An error occurred.';
    }
});

// Access Protected Route (Hello Route)
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
            responseDiv.textContent = `Protected data: ${JSON.stringify(data, null, 2)}`;
        } else {
            responseDiv.textContent = `Error: ${data.error}`;
        }
    } catch (error) {
        console.error('Error:', error);
        responseDiv.textContent = 'An error occurred.';
    }
});
