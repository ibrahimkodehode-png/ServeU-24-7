const slides = document.querySelectorAll(".hero-slider .slide");
const sliderInner = document.querySelector(".hero-slider-inner");
const prevBtn = document.querySelector(".hero-slider .prev");
const nextBtn = document.querySelector(".hero-slider .next");
const dots = document.querySelectorAll(".hero-slider .dot");
const status = document.getElementById("slider-status");

let currentIndex = 0;
let sliderInterval = null;

function setSlideBackground(slide) {
  const bg = slide.dataset.bg;
  if (bg && !slide.style.backgroundImage) {
    slide.style.backgroundImage = `url(${bg})`;
  }
}

function preloadImage(url) {
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "image";
  link.href = url;
  document.head.appendChild(link);
}

function prefetchImage(url) {
  const link = document.createElement("link");
  link.rel = "prefetch";
  link.as = "image";
  link.href = url;
  document.head.appendChild(link);
}

// Load current slide + preload next 2 slides
function preloadNextSlides() {
  for (let i = 0; i <= 2; i++) {
    const index = (currentIndex + i) % slides.length;
    const slide = slides[index];
    setSlideBackground(slide);
    preloadImage(slide.dataset.bg);
  }
}

function updateSlider() {
  if (!sliderInner) return;

  sliderInner.style.transform = `translateX(-${currentIndex * 100}%)`;

  dots.forEach((dot, idx) => {
    dot.classList.toggle("active", idx === currentIndex);
    dot.setAttribute("aria-selected", idx === currentIndex);
  });

  if (status) {
    status.textContent = `Slide ${currentIndex + 1} of ${slides.length}`;
  }

  // preload current + next 2 slides
  preloadNextSlides();
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

if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    stopSlider();
    nextSlide();
    startSlider();
  });
}

if (prevBtn) {
  prevBtn.addEventListener("click", () => {
    stopSlider();
    prevSlide();
    startSlider();
  });
}

function startSlider() {
  stopSlider();
  sliderInterval = setInterval(nextSlide, 4000);
}

function stopSlider() {
  if (sliderInterval) clearInterval(sliderInterval);
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

/* SWIPE GESTURES FOR MOBILE */
let touchStartX = 0;
let touchEndX = 0;

if (sliderInner) {
  sliderInner.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  sliderInner.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });
}

function handleSwipe() {
  const swipeDistance = touchEndX - touchStartX;

  if (Math.abs(swipeDistance) > 50) {
    stopSlider();
    if (swipeDistance < 0) nextSlide();
    else prevSlide();
    startSlider();
  }
}

// Smooth scrolling for nav links
document.querySelectorAll(".main-nav-links a").forEach((link) => {
  link.addEventListener("click", (e) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth" });
  });
});

// ===== NEW: LAZY LOAD FOR CARDS =====
const cardImages = document.querySelectorAll(".card-image");

const cardObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const bg = el.dataset.bg;
        if (bg) el.style.backgroundImage = `url(${bg})`;
        observer.unobserve(el);
      }
    });
  },
  { threshold: 0.1 },
);

cardImages.forEach((card) => cardObserver.observe(card));

// PREFETCH for program card images
cardImages.forEach((card) => {
  const bg = card.dataset.bg;
  if (bg) prefetchImage(bg);
});

// Start slider
updateSlider();
startSlider();

/* ===== ABOUT SECTION SCROLL ANIMATION ===== */
const aboutColumns = document.querySelectorAll(".about-column");

const aboutObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        aboutObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 },
);

aboutColumns.forEach((col) => aboutObserver.observe(col));

/* ===== MATCH LOGO + ABOUT TITLE ===== */
const aboutTitle = document.querySelector(".intro-box h2");
const aboutSection = document.querySelector("#about");

const titleObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        aboutTitle.classList.add("glow");
      } else {
        aboutTitle.classList.remove("glow");
      }
    });
  },
  { threshold: 0.3 },
);

if (aboutSection) titleObserver.observe(aboutSection);

// ===== MODAL POPUP FOR PROGRAM CARDS =====
const modal = document.getElementById("programModal");
const modalTitle = document.getElementById("modalTitle");
const modalContent = document.getElementById("modalContent");
const modalClose = document.querySelector(".modal-close");

document.querySelectorAll(".program-card").forEach((card) => {
  card.addEventListener("click", (e) => {
    e.preventDefault(); // stop link navigation

    modalTitle.textContent = card.dataset.title;
    modalContent.textContent = card.dataset.content;

    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  });
});

function closeModal() {
  modal.classList.remove("active");
  document.body.style.overflow = "";
}

modalClose.addEventListener("click", closeModal);

modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("active")) {
    closeModal();
  }
});
