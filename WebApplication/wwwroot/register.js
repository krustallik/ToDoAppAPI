document.getElementById('register-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value.trim();

    const registerData = { email, password };

    try {
        const response = await fetch('/api/account/register', {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registerData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Помилка при реєстрації');
        }

        alert('Реєстрація пройшла успішно! Тепер Ви можете увійти.');
