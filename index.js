let menuIcon = document.querySelector(".icon i");
let navLinks = document.querySelector(".navlinks");
let iconContainer = document.querySelector(".icon");

// Hamburger menu functionality
iconContainer.onclick = function () {
  if (menuIcon.classList.contains("bx-menu")) {
    menuIcon.classList.remove("bx-menu");
    menuIcon.classList.add("bx-x");
  } else {
    menuIcon.classList.remove("bx-x");
    menuIcon.classList.add("bx-menu");
  }
  navLinks.classList.toggle("open");
};

// --- Corrected Slider Functionality ---


