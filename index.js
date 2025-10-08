let menuIcon = document.querySelector('.icon i');
let navLinks = document.querySelector('.navlinks');
let iconContainer = document.querySelector('.icon');


iconContainer.onclick = function() {
    if (menuIcon.classList.contains('bx-menu')) {
        menuIcon.classList.remove('bx-menu');
        menuIcon.classList.add('bx-x');
    } else {
        menuIcon.classList.remove('bx-x');
        menuIcon.classList.add('bx-menu');
    }
    navLinks.classList.toggle('open');
}

var swiper = new Swiper(".home-slider", {
    slidesPerView: 1,
    loop: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });