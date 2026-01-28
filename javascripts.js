/* =========================================================
   HERO SLIDER
========================================================= */

const slides = document.querySelectorAll(".hero-slider .slide");
const sliderInner = document.querySelector(".hero-slider-inner");
const prevBtn = document.querySelector(".hero-slider .prev");
const nextBtn = document.querySelector(".hero-slider .next");
const dots = document.querySelectorAll(".hero-slider .dot");
const status = document.getElementById("slider-status");

let currentIndex = 0;
let sliderInterval = null;

if (slides.length && sliderInner) {
  function setSlideBackground(slide) {
    const bg = slide.dataset.bg;
    if (bg && !slide.style.backgroundImage) {
      slide.style.backgroundImage = `url(${bg})`;
    }
  }

  function preloadImage(url) {
    if (!url) return;
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = url;
    document.head.appendChild(link);
  }

  function preloadNextSlides() {
    for (let i = 0; i <= 2; i++) {
      const index = (currentIndex + i) % slides.length;
      const slide = slides[index];
      setSlideBackground(slide);
      preloadImage(slide.dataset.bg);
    }
  }

  function updateSlider() {
    sliderInner.style.transform = `translateX(-${currentIndex * 100}%)`;

    dots.forEach((dot, idx) => {
      dot.classList.toggle("active", idx === currentIndex);
      dot.setAttribute("aria-selected", idx === currentIndex);
    });

    if (status) {
      status.textContent = `Slide ${currentIndex + 1} of ${slides.length}`;
    }

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

  function startSlider() {
    stopSlider();
    sliderInterval = setInterval(nextSlide, 4000);
  }

  function stopSlider() {
    if (sliderInterval) clearInterval(sliderInterval);
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener("click", () => {
      currentIndex = idx;
      updateSlider();
      startSlider();
    });
  });

  nextBtn?.addEventListener("click", () => {
    stopSlider();
    nextSlide();
    startSlider();
  });

  prevBtn?.addEventListener("click", () => {
    stopSlider();
    prevSlide();
    startSlider();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") nextSlide();
    if (e.key === "ArrowLeft") prevSlide();
  });

  /* Swipe */
  let touchStartX = 0;
  sliderInner.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  sliderInner.addEventListener("touchend", (e) => {
    const diff = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(diff) > 50) diff < 0 ? nextSlide() : prevSlide();
  });

  updateSlider();
  startSlider();
}

/* =========================================================
   SMOOTH SCROLL (SAMO # LINKOVI)
========================================================= */

document.querySelectorAll('.main-nav-links a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth" });
  });
});

/* =========================================================
   LAZY LOAD – PROGRAM CARDS
========================================================= */

const cardImages = document.querySelectorAll(".card-image");

if (cardImages.length) {
  const cardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bg = entry.target.dataset.bg;
          if (bg) entry.target.style.backgroundImage = `url(${bg})`;
          cardObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );

  cardImages.forEach((card) => cardObserver.observe(card));
}

/* =========================================================
   ABOUT SECTION ANIMATIONS
========================================================= */

const aboutColumns = document.querySelectorAll(".about-column");

if (aboutColumns.length) {
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
}

/* =========================================================
   PROGRAM MODAL
========================================================= */

const modal = document.getElementById("programModal");

if (modal) {
  const modalTitle = document.getElementById("modalTitle");
  const modalContent = document.getElementById("modalContent");
  const modalClose = document.querySelector(".modal-close");

  document.querySelectorAll(".program-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      e.preventDefault();

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

  modalClose?.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

/* =========================================================
   HAMBURGER MENU (CLEAN)
========================================================= */

const hamburger = document.querySelector(".hamburger");
const mobileNav = document.querySelector(".mobile-nav");

if (hamburger && mobileNav) {
  hamburger.addEventListener("click", () => {
    const isOpen = hamburger.classList.toggle("active");
    mobileNav.classList.toggle("active");
    hamburger.setAttribute("aria-expanded", isOpen);
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      mobileNav.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });
}
