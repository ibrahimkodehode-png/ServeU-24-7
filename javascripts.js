// Load background images for card-image
document.querySelectorAll(".card-image").forEach((card) => {
  const bg = card.dataset.bg;
  card.style.backgroundImage = `url(${bg})`;
});

// HERO
const slides = document.querySelectorAll(".hero-slider .slide");
const sliderInner = document.querySelector(".hero-slider-inner");
const prevBtn = document.querySelector(".hero-slider .prev");
const nextBtn = document.querySelector(".hero-slider .next");
const dots = document.querySelectorAll(".hero-slider .dot");
const status = document.getElementById("slider-status");

let currentIndex = 0;
let sliderInterval = null;

// Set background images
slides.forEach((slide) => {
  const bg = slide.dataset.bg;
  slide.style.backgroundImage = `url(${bg})`;
});

// Set initial state
function updateSlider() {
  sliderInner.style.transform = `translateX(-${currentIndex * 100}%)`;
  dots.forEach((dot, idx) => {
    dot.classList.toggle("active", idx === currentIndex);
    dot.setAttribute("aria-selected", idx === currentIndex);
  });

  status.textContent = `Slide ${currentIndex + 1} of ${slides.length}`;
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % slides.length;
  updateSlider();
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  updateSlider();
}

dots.forEach((dot, idx) => {
  dot.addEventListener("click", () => {
    currentIndex = idx;
    updateSlider();
    stopSlider();
    startSlider();
  });
});

nextBtn.addEventListener("click", () => {
  stopSlider();
  nextSlide();
  startSlider();
});

prevBtn.addEventListener("click", () => {
  stopSlider();
  prevSlide();
  startSlider();
});

function startSlider() {
  sliderInterval = setInterval(nextSlide, 4000);
}

function stopSlider() {
  clearInterval(sliderInterval);
}

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") {
    stopSlider();
    nextSlide();
    startSlider();
  } else if (e.key === "ArrowLeft") {
    stopSlider();
    prevSlide();
    startSlider();
  }
});

/* ===== SWIPE GESTURES FOR MOBILE ===== */
let touchStartX = 0;
let touchEndX = 0;

sliderInner.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

sliderInner.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  const swipeDistance = touchEndX - touchStartX;

  // Minimum swipe distance
  if (Math.abs(swipeDistance) > 50) {
    if (swipeDistance < 0) {
      stopSlider();
      nextSlide();
      startSlider();
    } else {
      stopSlider();
      prevSlide();
      startSlider();
    }
  }
}

// Toggle About section
const toggleBtn = document.getElementById("toggle-button");
const aboutBox = document.querySelector(".about-box");

toggleBtn.addEventListener("click", () => {
  aboutBox.classList.toggle("hidden");
  toggleBtn.textContent = aboutBox.classList.contains("hidden")
    ? "Show About Us"
    : "Hide About Us";
});

// Smooth scrolling for nav links
document.querySelectorAll(".main-nav-links a").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute("href"));
    target.scrollIntoView({ behavior: "smooth" });
  });
});

// Start slider
updateSlider();
startSlider();
