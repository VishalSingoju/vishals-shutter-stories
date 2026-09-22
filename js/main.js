document.addEventListener("DOMContentLoaded", () => {
  const yearElements = document.querySelectorAll("[data-year]");
  yearElements.forEach(el => el.textContent = new Date().getFullYear());

  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.textContent = open ? "Close" : "Menu";
    });

    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.textContent = "Menu";
      });
    });
  }

  const lightbox = document.querySelector("[data-lightbox]");
  if (!lightbox) return;

  const lightboxImage = lightbox.querySelector("[data-lightbox-image]");
  const lightboxCaption = lightbox.querySelector("[data-lightbox-caption]");
  const closeButton = lightbox.querySelector("[data-lightbox-close]");
  const prevButton = lightbox.querySelector("[data-lightbox-prev]");
  const nextButton = lightbox.querySelector("[data-lightbox-next]");

  let currentIndex = 0;
  let images = [];

  window.openLightbox = (index, galleryImages) => {
    images = galleryImages;
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    closeButton.focus();
  };

  function updateLightbox() {
    const item = images[currentIndex];
    if (!item) return;

    lightboxImage.src = item.src;
    lightboxImage.alt = item.alt || "";
    lightboxCaption.textContent = item.caption || "";

    const multiple = images.length > 1;
    prevButton.hidden = !multiple;
    nextButton.hidden = !multiple;
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    lightboxImage.src = "";
  }

  function previous() {
    if (!images.length) return;
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateLightbox();
  }

  function next() {
    if (!images.length) return;
    currentIndex = (currentIndex + 1) % images.length;
    updateLightbox();
  }

  closeButton.addEventListener("click", closeLightbox);
  prevButton.addEventListener("click", previous);
  nextButton.addEventListener("click", next);

  lightbox.addEventListener("click", event => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", event => {
    if (!lightbox.classList.contains("is-open")) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") previous();
    if (event.key === "ArrowRight") next();
  });
});
