// Toggle sidebar visibility when menu button is clicked
document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
  
    toggleButton.addEventListener('click', () => {
      sidebar.classList.toggle('sidebar-visible');
    });
  
    // Hide sidebar when scrolling
    window.addEventListener('scroll', () => {
      if (sidebar.classList.contains('sidebar-visible')) {
        sidebar.classList.remove('sidebar-visible');
      }
    });
  
    // script.js
  
  // script.js
  
  const images = [
  'images/image1.png',
  'images/image2.png',
  'images/image3.png',
  'images/image4.png',
  'images/image.png',
  'images/images (6).jpeg',
  'images/images (7).jpeg',
  'images/images (8).jpeg',
  'images/images (9).jpeg',
  'images/images (10).jpeg',
  'images/images (11).jpeg',
  'images/images (12).jpeg',
  'images/images (13).jpeg',
  'images/images (14).jpeg',
  'images/images (15).jpeg',
  'images/images (16).jpeg',
  'images/images (17).jpeg',
  'images/images (18).jpeg',
  'images/images (19).jpeg',
  'images/images (20).jpeg',
  'images/images (21).jpeg',
  'images/images (22).jpeg',
  'images/images (23).jpeg',
  'images/contact-center.webp',
  ];
  
  let index = 0;
  let activeLayer = 1;
  
  const bg1 = document.getElementById('background1');
  const bg2 = document.getElementById('background2');
  
  function changeBackground() {
    index = (index + 1) % images.length;
    const nextImage = images[index];
  
    if (activeLayer === 1) {
        bg2.style.backgroundImage = `url('${nextImage}')`;
        bg2.classList.add('active');
        bg1.classList.remove('active');
        activeLayer = 2;
    } else {
        bg1.style.backgroundImage = `url('${nextImage}')`;
        bg1.classList.add('active');
        bg2.classList.remove('active');
        activeLayer = 1;
    }
  }
  
  // Set initial image
  bg1.style.backgroundImage = `url('${images[0]}')`;
  bg1.classList.add('active');
  
  // Start slideshow
  setInterval(changeBackground, 5000); // Change every 5 seconds
  });
  
  
  document.addEventListener('DOMContentLoaded', function () {
  const searchForm = document.getElementById('search-form');
  
  if (searchForm) {
    searchForm.addEventListener('submit', function (e) {
      e.preventDefault(); // Prevent page reload
      const query = this.query.value.trim();
  
      if (query !== "") {
        console.log("Searching for:", query); // For debugging
        // Example: Redirect to a search results page
        // window.location.href = `search.html?q=${encodeURIComponent(query)}`;
      } else {
        alert("Please enter a search term.");
      }
    });
  }
  });
  
  document.addEventListener("DOMContentLoaded", function () {
      const bookButtons = document.querySelectorAll(".book-btn") 
        bookButtons.forEach(button => {
        button.addEventListener("click", () => {
        window.location.href = "details.html";
        });
     });
    });
    
    
// Auto logout after 5 minutes of inactivity
let logoutTimer;

// Function to reset the timer
function resetLogoutTimer() {
    clearTimeout(logoutTimer);
    logoutTimer = setTimeout(logUserOut, 300000); // 300,000 ms = 5 minutes
}

// Function to log the user out
async function logUserOut() {
    try {
        // Send a logout request to the server
        await fetch('/logout', { method: 'POST' });
        window.location.href = '/login.html'; // Redirect to login page after logout
    } catch (error) {
        console.error('Error logging out:', error);
    }
}

// Reset the timer on user activity (mousemove, keydown, click)
document.addEventListener('mousemove', resetLogoutTimer);
document.addEventListener('keydown', resetLogoutTimer);
document.addEventListener('click', resetLogoutTimer);

// Start the timer on page load
resetLogoutTimer();
  