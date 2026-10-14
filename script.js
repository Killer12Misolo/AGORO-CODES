(() => {
  "use strict";

  const navbar = document.getElementById("navbar");
  const menuButton = document.getElementById("menuButton");
  const navLinks = document.getElementById("primaryNavigation");
  const stars = document.getElementById("stars");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxDialog = lightbox?.querySelector(".lightbox-dialog");
  const closeLightboxButton = document.getElementById("closeLightbox");
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  // Add a real ticket provider URL when ticket sales are ready.
  const TICKET_URL = "";
  let lastGalleryTrigger = null;
  let menuWasOpenBeforeLightbox = false;

  function configureTicketLinks() {
    document.querySelectorAll(".ticket-link").forEach((link) => {
      if (TICKET_URL) {
        link.href = TICKET_URL;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      } else {
        link.href = "#contact";
        link.removeAttribute("target");
        link.removeAttribute("rel");
      }
    });
  }

  function createStars() {
    if (!stars || reducedMotionQuery.matches) return;
    const fragment = document.createDocumentFragment();

    for (let index = 0; index < 120; index += 1) {
      const star = document.createElement("span");
      const size = (Math.random() * 2 + 1).toFixed(2);
      star.className = "star";
      star.setAttribute("aria-hidden", "true");
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${(Math.random() * 100).toFixed(2)}%`;
      star.style.top = `${(Math.random() * 100).toFixed(2)}%`;
      star.style.animationDelay = `${(Math.random() * 5).toFixed(2)}s`;
      fragment.appendChild(star);
    }
    stars.replaceChildren(fragment);
  }

  function updateNavbar() {
    navbar?.classList.toggle("scrolled", window.scrollY > 30);
  }

  function closeMenu({ returnFocus = false } = {}) {
    if (!navLinks || !menuButton) return;
    navLinks.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
    document.body.classList.remove("menu-open");
    const icon = menuButton.querySelector("span");
    if (icon) icon.textContent = "☰";
    if (returnFocus) menuButton.focus();
  }

  function toggleMenu() {
    if (!navLinks || !menuButton) return;
    const isOpen = !navLinks.classList.contains("open");
    if (isOpen) {
      navLinks.classList.add("open");
      document.body.classList.add("menu-open");
    } else {
      closeMenu();
    }
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    const icon = menuButton.querySelector("span");
    if (icon) icon.textContent = isOpen ? "×" : "☰";
    if (isOpen) navLinks.querySelector("a")?.focus();
  }

  function openLightbox(button) {
    if (!lightbox || !lightboxImage) return;
    const imagePath = button.dataset.image;
    if (!imagePath) return;

    lastGalleryTrigger = button;
    menuWasOpenBeforeLightbox = navLinks?.classList.contains("open") ?? false;
    lightboxImage.src = imagePath;
    lightboxImage.alt = button.dataset.alt || "Gallery image";
    lightbox.hidden = false;
    document.body.classList.add("lightbox-open");
    closeLightboxButton?.focus();
  }

  function closeLightbox() {
    if (!lightbox || lightbox.hidden) return;
    lightbox.hidden = true;
    lightboxImage?.removeAttribute("src");
    lightboxImage?.removeAttribute("alt");
    document.body.classList.remove("lightbox-open");
    if (menuWasOpenBeforeLightbox) document.body.classList.add("menu-open");
    lastGalleryTrigger?.focus();
    lastGalleryTrigger = null;
  }

  function handleDialogKeydown(event) {
    if (!lightbox || lightbox.hidden) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeLightbox();
      return;
    }
    if (event.key !== "Tab" || !lightboxDialog) return;

    const focusable = [...lightboxDialog.querySelectorAll(
      'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )].filter((element) => element.getClientRects().length > 0);
    if (!focusable.length) {
      event.preventDefault();
      lightboxDialog.focus();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  configureTicketLinks();
  createStars();
  updateNavbar();

  menuButton?.addEventListener("click", toggleMenu);
  document.querySelectorAll("#primaryNavigation a").forEach((link) => {
    link.addEventListener("click", () => closeMenu());
  });

  document.addEventListener("click", (event) => {
    if (!navLinks?.classList.contains("open")) return;
    if (navLinks.contains(event.target) || menuButton?.contains(event.target)) return;
    closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 901px)").matches) closeMenu();
  });
  window.addEventListener("scroll", updateNavbar, { passive: true });

  document.querySelectorAll(".gallery-item").forEach((button) => {
    button.addEventListener("click", () => openLightbox(button));
  });
  closeLightboxButton?.addEventListener("click", closeLightbox);
  document.querySelectorAll("[data-close-lightbox]").forEach((element) => {
    element.addEventListener("click", closeLightbox);
  });
  document.addEventListener("keydown", handleDialogKeydown);

  if (!reducedMotionQuery.matches) {
    const heroImage = document.querySelector(".hero-image");
    if (heroImage) {
      let ticking = false;
      window.addEventListener("scroll", () => {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(() => {
          const offset = Math.min(window.scrollY * 0.15, 100);
          heroImage.style.transform = `translate3d(0, ${offset}px, 0) scale(1.04)`;
          ticking = false;
        });
      }, { passive: true });
    }
  }
})();
