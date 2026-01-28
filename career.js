// ANIMACIJA JOB KARTICA
const jobCards = document.querySelectorAll(".job-card");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 },
);

jobCards.forEach((card) => observer.observe(card));

// MODAL ZA APPLY FORMU
const applyBtns = document.querySelectorAll(".apply-btn");
const modal = document.getElementById("applyModal");
const modalClose = document.querySelector(".modal-close");

const form = document.getElementById("applyForm");
const successMessage = document.getElementById("successMessage");

applyBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  });
});

function closeModal() {
  modal.classList.remove("active");
  document.body.style.overflow = "";

  // reset form state
  form.reset();
  form.style.display = "flex";
  successMessage.style.display = "none";
}

modalClose.addEventListener("click", closeModal);

modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

/* SUBMIT FORME */
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // hide form
  form.style.display = "none";

  // show success message
  successMessage.style.display = "block";
});

/* ===== HAMBURGER MENU ===== */
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
