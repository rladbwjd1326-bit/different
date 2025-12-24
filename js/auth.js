/* auth.js - Login and Signup Logic */

document.addEventListener('DOMContentLoaded', () => {
    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const btn = loginForm.querySelector('button');

            try {
                btn.disabled = true;
                btn.textContent = 'Logging in...';

                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Login failed');
                }

                // Save Token & User Info
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                alert('Login successful!');
                window.location.href = '../index.html';

            } catch (err) {
                alert(err.message);
                btn.disabled = false;
                btn.textContent = 'Log In';
            }
        });
    }

    // Signup Form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            // Add nickname input handling if it exists in HTML, or add it to HTML.
            // Wait, the Schema requires nickname. The HTML currently doesn't have it.
            // I need to add nickname field to signup.html as well.

            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            // For now, let's assume I will add nickname field.
            const nicknameInput = document.getElementById('nickname');
            const nickname = nicknameInput ? nicknameInput.value : email.split('@')[0]; // Fallback

            const btn = signupForm.querySelector('button');

            try {
                btn.disabled = true;
                btn.textContent = 'Signing up...';

                const response = await fetch('/api/auth/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password, nickname })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Signup failed');
                }

                alert('Account created! Please log in.');
                window.location.href = 'login.html';

            } catch (err) {
                alert(err.message);
                btn.disabled = false;
                btn.textContent = 'Sign Up';
            }
        });
    }
});
