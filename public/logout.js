// Auto logout after 5 minutes of inactivity
let logoutTimer;

// Function to reset the timer
function resetLogoutTimer() {
    clearTimeout(logoutTimer);
    logoutTimer = setTimeout(logUserOut, 300000); // 5 minutes
}

// Function to log the user out
async function logUserOut() {
    try {
        await fetch('/logout', { method: 'POST' });
        window.location.href = 'user-login.html'; // Redirect to login page
    } catch (error) {
        console.error('Error logging out:', error);
    }
}

// Reset the timer on user activity
document.addEventListener('mousemove', resetLogoutTimer);
document.addEventListener('keydown', resetLogoutTimer);
document.addEventListener('click', resetLogoutTimer);

// Initialize the timer
resetLogoutTimer();
