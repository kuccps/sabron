document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");
    const resetForm = document.getElementById("reset-form");
    const showSignupBtn = document.getElementById("show-signup-btn");
    const resetBtn = document.getElementById("reset-btn");
    const formTitle = document.getElementById("form-title");
    const loginMessage = document.getElementById("login-message");
    const resetMessage = document.getElementById("reset-message");
    const submitResetBtn = document.getElementById("submit-reset");
  
    // Show Sign Up Form
    showSignupBtn.addEventListener("click", () => {
      loginForm.style.display = "none";
      signupForm.style.display = "block";
      resetForm.style.display = "none";
      formTitle.textContent = "Sign Up";
      loginMessage.style.display = "none";
      resetMessage.style.display = "none";
    });
  
    // Show Reset Form
    resetBtn.addEventListener("click", () => {
      loginForm.style.display = "none";
      signupForm.style.display = "none";
      resetForm.style.display = "block";
      formTitle.textContent = "Reset Password";
      loginMessage.style.display = "none";
      resetMessage.style.display = "none";
    });
  
    // Handle Sign Up
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const newUsername = signupForm.newUsername.value.trim();
      const newPassword = signupForm.newPassword.value.trim();
  
      if (newUsername && newPassword) {
        localStorage.setItem("savedUsername", newUsername);
        localStorage.setItem("savedPassword", newPassword);
  
        loginMessage.textContent = "Sign Up successful! Please log in.";
        loginMessage.style.color = "lightgreen";
        loginMessage.style.display = "block";
  
        signupForm.reset();
        signupForm.style.display = "none";
        loginForm.style.display = "block";
        formTitle.textContent = "Login";
      }
    });
  
    // Handle Login
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = loginForm.username.value.trim();
      const password = loginForm.password.value.trim();
  
      const savedUsername = localStorage.getItem("savedUsername");
      const savedPassword = localStorage.getItem("savedPassword");
  
      if (username === savedUsername && password === savedPassword) {
        loginMessage.textContent = "Login successful! Redirecting...";
        loginMessage.style.color = "lightgreen";
        loginMessage.style.display = "block";
  
        setTimeout(() => {
          window.location.href = "../cyberservices.html"; // Make sure this path is correct
        }, 1000);
      } else {
        loginMessage.textContent = "Incorrect username or password!";
        loginMessage.style.color = "red";
        loginMessage.style.display = "block";
      }
    });
  
    submitResetBtn.addEventListener("click", () => {
        const username = document.getElementById("reset-username").value.trim();
        const newPassword = document.getElementById("new-password").value.trim();
      
        const savedUsername = localStorage.getItem("savedUsername");
      
        if (username === savedUsername) {
          localStorage.setItem("savedPassword", newPassword);
          resetMessage.textContent = "Password reset successful!";
          resetMessage.style.color = "lightgreen";
          resetMessage.style.display = "block";
      
          setTimeout(() => {
            resetForm.style.display = "none";
            loginForm.style.display = "block";
            formTitle.textContent = "Login";
            resetMessage.style.display = "none";
          }, 2000);
        } else {
          resetMessage.textContent = "Username not found!";
          resetMessage.style.color = "red";
          resetMessage.style.display = "block";
        }
      });
    });      
  