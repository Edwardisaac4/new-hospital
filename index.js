/*==================== NAVIGATION / HAMBURGER MENU ====================*/
const navlinks = document.querySelector(".navlinks");
const iconContainer = document.querySelector(".icon");
const menuIcon = document.querySelector(".icon i");

// Toggles the mobile navigation menu and hamburger icon
iconContainer.addEventListener("click", () => {
  if (!menuIcon) return;
  if (menuIcon.classList.contains("bx-menu")) {
    menuIcon.classList.remove("bx-menu");
    menuIcon.classList.add("bx-x");
  } else {
    menuIcon.classList.remove("bx-x");
    menuIcon.classList.add("bx-menu");
  }
  navlinks.classList.toggle("open");
});

/*==================== HERO SLIDER ====================*/
// This section controls the main slider at the top of the page.
// It includes functionality for auto-play, navigation arrows, dots, and an infinite loop effect.
const slider = document.querySelector(".slider");
let slides = document.querySelectorAll(".slide");
const dotsContainer = document.querySelector(".slider-dots");
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");

let currentSlide = 0;
let slideCount = slides.length;
let autoPlayInterval;

if (slider && slides.length > 0) {
  // Clone the first slide and append it to the end for infinite loop effect
  const firstSlideClone = slides[0].cloneNode(true);
  slider.appendChild(firstSlideClone);
  slides = document.querySelectorAll(".slide"); // Re-query slides to include the clone
  const totalSlides = slides.length;

  // Update slider width to account for the cloned slide
  slider.style.width = `${totalSlides * 100}%`;

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => {
      goToSlide(i);
      resetAutoPlay();
    });
    // Only create dots for the original slides
    if (i < slideCount) {
      dotsContainer.appendChild(dot);
    }
  });

  const dots = document.querySelectorAll(".dot");

  const goToSlide = (slideIndex) => {
    slider.style.transform = `translateX(-${slideIndex * (100 / totalSlides)}%)`;
    dots.forEach((dot) => dot.classList.remove("active"));
    // Highlight the correct dot, accounting for the loop
    dots[slideIndex % slideCount].classList.add("active");
    slides.forEach(slide => slide.classList.remove('active'));
    slides[slideIndex].classList.add('active');
    currentSlide = slideIndex;
  };

  const nextSlide = () => {
    currentSlide = (currentSlide + 1) % slideCount;
    goToSlide(currentSlide);

    // If we've moved to the cloned slide, reset to the first slide without transition
    if (currentSlide === slideCount) {
      setTimeout(() => {
        slider.classList.add('no-transition');
        goToSlide(0);
        setTimeout(() => slider.classList.remove('no-transition'), 50);
      }, 500); // Must be equal to the transition duration in CSS
    }
  };

  const prevSlide = () => {
    currentSlide = (currentSlide - 1 + slideCount) % slideCount;
    goToSlide(currentSlide);
  };

  const resetAutoPlay = () => {
    clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(nextSlide, 7000);
  };

  nextBtn.addEventListener("click", () => {
    nextSlide();
    resetAutoPlay();
  });

  prevBtn.addEventListener("click", () => {
    prevSlide();
    resetAutoPlay();
  });

  // Auto-play slider
  autoPlayInterval = setInterval(nextSlide, 7000); // Change slide every 7 seconds

  // Initial animation for the first slide
  slides[0].classList.add('active');
}

/*==================== DOCTORS SLIDER ====================*/
// This section controls the carousel for the "Our Doctors" section.
// It includes logic for responsive slides-per-view and touch/drag swiping.
const doctorsSlider = document.querySelector('.inner-dcts');
const doctorSlides = document.querySelectorAll('.doc-card');
const doctorsPrevBtn = document.querySelector('.doctors-prev-btn');
const doctorsNextBtn = document.querySelector('.doctors-next-btn');

if (doctorsSlider && doctorSlides.length > 0) {
  let doctorSlideIndex = 0;
  let slidesPerView = 3;
  let isDragging = false;
  let startPos = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationID = 0;

  const updateSlidesPerView = () => {
    if (window.innerWidth <= 760) {
      slidesPerView = 1;
    } else if (window.innerWidth <= 1024) {
      slidesPerView = 2;
    } else {
      slidesPerView = 3;
    }
  };

  const goToDoctorSlide = (index) => {
    if (index < 0) {
      index = 0;
    }
    if (index > doctorSlides.length - slidesPerView) {
      index = doctorSlides.length - slidesPerView;
    }
    setSliderPosition(index);
    doctorSlideIndex = index;
  };

  doctorsNextBtn.addEventListener('click', () => {
    goToDoctorSlide(doctorSlideIndex + 1);
  });

  doctorsPrevBtn.addEventListener('click', () => {
    goToDoctorSlide(doctorSlideIndex - 1);
  });

  const setSliderPosition = (index) => {
    const offset = index * (doctorsSlider.clientWidth / slidesPerView);
    doctorsSlider.style.transform = `translateX(-${offset}px)`;
  }

  const touchStart = (index) => (event) => {
    isDragging = true;
    startPos = getPositionX(event);
    animationID = requestAnimationFrame(animation);
    doctorsSlider.classList.add('grabbing');
  };

  const touchEnd = () => {
    isDragging = false;
    cancelAnimationFrame(animationID);

    const movedBy = currentTranslate - prevTranslate;

    if (movedBy < -100 && doctorSlideIndex < doctorSlides.length - slidesPerView) {
      doctorSlideIndex += 1;
    }

    if (movedBy > 100 && doctorSlideIndex > 0) {
      doctorSlideIndex -= 1;
    }

    goToDoctorSlide(doctorSlideIndex);
    doctorsSlider.classList.remove('grabbing');
  };

  const touchMove = (event) => {
    if (isDragging) {
      const currentPosition = getPositionX(event);
      currentTranslate = prevTranslate + currentPosition - startPos;
    }
  };

  const getPositionX = (event) => {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
  };

  const animation = () => {
    doctorsSlider.style.transform = `translateX(${currentTranslate}px)`;
    if (isDragging) requestAnimationFrame(animation);
  };

  // Add touch event listeners
  doctorsSlider.addEventListener('touchstart', touchStart(0));
  doctorsSlider.addEventListener('touchend', touchEnd);
  doctorsSlider.addEventListener('touchmove', touchMove);

  // Add mouse event listeners for dragging
  doctorsSlider.addEventListener('mousedown', touchStart(0));
  doctorsSlider.addEventListener('mouseup', touchEnd);
  doctorsSlider.addEventListener('mouseleave', () => {
    if (isDragging) {
      touchEnd();
    }
  });
  doctorsSlider.addEventListener('mousemove', touchMove);

  window.addEventListener('resize', () => {
    updateSlidesPerView();
    goToDoctorSlide(doctorSlideIndex);
  });

  updateSlidesPerView();
}

/*==================== CUSTOMER REVIEWS SLIDER ====================*/
// This section controls the carousel for the "Customer Reviews" section.
// It includes logic for auto-playing, navigation dots, and responsive slides-per-view.
const reviewSlider = document.querySelector('.review-content');
const reviewSlides = document.querySelectorAll('.review-box');
const reviewDotsContainer = document.querySelector('.review-slider-dots');

if (reviewSlider && reviewSlides.length > 0) {
    let currentReviewSlide = 0;
    let slidesPerView = 1;

    const updateReviewSlidesPerView = () => {
        if (window.innerWidth > 1024) {
            slidesPerView = 3;
        } else if (window.innerWidth > 760) {
            slidesPerView = 2;
        } else {
            slidesPerView = 1;
        }
        reviewSlides.forEach(slide => {
            slide.style.flex = `0 0 calc(100% / ${slidesPerView} - 2rem)`;
        });
    };

    // Create dots
    const slideCount = Math.ceil(reviewSlides.length / slidesPerView);
    for (let i = 0; i < slideCount; i++) {
        const dot = document.createElement('div');
        dot.classList.add('review-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToReviewSlide(i));
        reviewDotsContainer.appendChild(dot);
    }

    const reviewDots = document.querySelectorAll('.review-dot');

    const goToReviewSlide = (slideIndex) => {
        const maxSlide = Math.ceil(reviewSlides.length / slidesPerView) - 1;
        if (slideIndex > maxSlide) slideIndex = 0;
        if (slideIndex < 0) slideIndex = maxSlide;

        const offset = slideIndex * 100;
        reviewSlider.style.transform = `translateX(-${offset}%)`;
        reviewDots.forEach(dot => dot.classList.remove('active'));
        if (reviewDots[slideIndex]) {
            reviewDots[slideIndex].classList.add('active');
        }
        currentReviewSlide = slideIndex;
    };

    let autoPlayReview = setInterval(() => {
        goToReviewSlide(currentReviewSlide + 1);
    }, 5000);

    reviewSlider.addEventListener('mouseover', () => clearInterval(autoPlayReview));
    reviewSlider.addEventListener('mouseout', () => {
        autoPlayReview = setInterval(() => {
            goToReviewSlide(currentReviewSlide + 1);
        }, 5000);
    });

    window.addEventListener('resize', updateReviewSlidesPerView);
    updateReviewSlidesPerView();
}

/*==================== ANIMATED COUNTERS (ABOUT US) ====================*/
// This section controls the animated number counters in the "About Us" section.
// It uses an IntersectionObserver to trigger the animation when the section is scrolled into view.
const counters = document.querySelectorAll('.counter');
const statsSection = document.querySelector('.about-stats');

// Function to animate a single counter from 0 to its target value
const startCounter = (counter) => {
  const target = +counter.getAttribute('data-target');
  const increment = target / 200;

  const updateCounter = () => {
    const currentValue = +counter.innerText;
    if (currentValue < target) {
      counter.innerText = `${Math.ceil(currentValue + increment)}`;
      setTimeout(updateCounter, 10);
    } else {
      counter.innerText = target;
    }
  };
  updateCounter();
};

// Observer to detect when the stats section is visible
const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      counters.forEach(counter => startCounter(counter));
      observer.unobserve(statsSection);
    }
  });
}, { threshold: 0.5 });

if (statsSection) {
  observer.observe(statsSection);
}
