const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("loginButton");
const loginMessage = document.getElementById("loginMessage");

const correctEmail = "user@example.com";
const correctPassword = "password123";

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const email = emailInput.value
  const password = passwordInput.value;

  if (email === correctEmail && password === correctPassword) {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("loginMessage", "true");

    window.location.href = "../index.html";
    } else {
        loginMessage.textContent = "Invalid email or password. Please try again.";
    }
});

