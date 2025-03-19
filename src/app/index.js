document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const usernameError = document.getElementById('username-error');
    const passwordError = document.getElementById('password-error');

    // Form validation
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log("Submitted");
        const res = await fetch(new Request("http://localhost:80/login", { 
            method: "POST", 
            headers: {
                "Content-Type": "application/x-www-form-urlencoded" }, 
            body: new URLSearchParams({
                "user": usernameInput.value,
                "password": passwordInput.value})
            }));
        if (res.status == 200) window.location.href = "http://localhost:80/chat";
        else {
            usernameError.style.display = "block";
            passwordError.style.display = "block";
        }
    });

    // Clear error messages when user starts typing
    usernameInput.addEventListener('input', () => {
        usernameError.style.display = 'none';
    });

    passwordInput.addEventListener('input', () => {
        passwordError.style.display = 'none';
    });
});