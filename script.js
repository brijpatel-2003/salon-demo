/**
 * ============================================================
 * ROOP MILAN SALON — script.js
 * Premium Hair Salon Website | Nikol, Ahmedabad
 * Vanilla JavaScript — No frameworks, no libraries
 * ============================================================
 */

"use strict";

// Debug: Log when script loads
console.log("✅ Script.js loaded successfully");

/* ── DOM Ready wrapper ────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOMContentLoaded fired - JavaScript is working!");

  /* ============================================================
     1. PAGE PRELOADER
     ============================================================ */
  const preloader = document.getElementById("preloader");
  console.log("Preloader element:", preloader);

  /**
   * Hide the preloader after 2 seconds (matches the CSS animation).
   * Uses 'requestAnimationFrame' to avoid janky transitions.
   */
  function hidePreloader() {
    if (!preloader) {
      console.log("⚠️ Preloader element not found!");
      return;
    }
    console.log("Hiding preloader...");
    preloader.classList.add("hidden");
    // Remove from DOM after transition ends to improve accessibility
    // Also set a timeout fallback in case transitionend doesn't fire
    preloader.addEventListener(
      "transitionend",
      () => {
        console.log("✅ Preloader transition ended, removing from DOM");
        preloader.remove();
      },
      { once: true },
    );
    // Fallback: remove after 600ms even if transition doesn't fire
    setTimeout(() => {
      if (preloader && preloader.parentNode) {
        console.log("✅ Fallback: Force removing preloader");
        preloader.remove();
      }
    }, 600);
  }

  // Minimum display: 100ms for quick loading, then hide
  setTimeout(hidePreloader, 100);

  // Also hide once full page resources are loaded
  window.addEventListener("load", () => {
    setTimeout(hidePreloader, 100);
  });

  /* ============================================================
     2. STICKY NAVBAR  — shrinks on scroll
     ============================================================ */
  const navbar = document.getElementById("navbar");

  function handleNavbarScroll() {
    if (!navbar) return;
    if (window.scrollY > 60) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // run on load in case page is refreshed mid-scroll

  /* ============================================================
     3. MOBILE HAMBURGER MENU
     ============================================================ */
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  console.log("Hamburger element:", hamburger);
  console.log("NavLinks element:", navLinks);

  function toggleMenu() {
    console.log("🍔 Hamburger clicked!");
    if (!hamburger || !navLinks) return;
    const isOpen = hamburger.classList.toggle("active");
    navLinks.classList.toggle("open", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? "hidden" : "";
  }

  function closeMenu() {
    if (!hamburger || !navLinks) return;
    hamburger.classList.remove("active");
    navLinks.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  if (hamburger) {
    console.log("✅ Adding click listener to hamburger");
    hamburger.addEventListener("click", toggleMenu);
  } else {
    console.log("⚠️ Hamburger element not found!");
  }

  // Close menu when a link is clicked
  if (navLinks) {
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
  }

  // Close menu on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  /* ============================================================
     4. SMOOTH SCROLL  — handles hash-link clicks
     ============================================================ */
  const smoothScrollAnchors = document.querySelectorAll('a[href^="#"]');
  console.log(
    `Found ${smoothScrollAnchors.length} anchor links for smooth scrolling`,
  );

  smoothScrollAnchors.forEach((anchor, i) => {
    anchor.addEventListener("click", function (e) {
      console.log(`🔗 Anchor ${i} clicked:`, this.getAttribute("href"));
      const href = this.getAttribute("href");
      if (href === "#") {
        console.log("⚠️ href is just #, skipping");
        return;
      }

      const target = document.querySelector(href);
      if (!target) {
        console.log("⚠️ Target element not found:", href);
        return;
      }

      console.log("✅ Preventing default and smooth scrolling to:", href);
      e.preventDefault();

      const navHeight = navbar ? navbar.offsetHeight : 0;
      const targetTop =
        target.getBoundingClientRect().top + window.scrollY - navHeight - 16;

      window.scrollTo({ top: targetTop, behavior: "smooth" });
    });
  });

  /* ============================================================
     5. ACTIVE NAV LINK  — highlights current section
     ============================================================ */
  const sections = document.querySelectorAll("section[id]");
  const navAnchors = document.querySelectorAll(".nav-link");

  let navTicking = false;

  function updateActiveNavLink() {
    if (!navTicking) {
      requestAnimationFrame(() => {
        const scrollPos =
          window.scrollY + (navbar ? navbar.offsetHeight : 0) + 80;

        sections.forEach((section) => {
          const top = section.offsetTop;
          const bottom = top + section.offsetHeight;

          if (scrollPos >= top && scrollPos < bottom) {
            navAnchors.forEach((a) => a.classList.remove("active"));
            const active = document.querySelector(
              `.nav-link[href="#${section.id}"]`,
            );
            if (active) active.classList.add("active");
          }
        });

        navTicking = false;
      });
      navTicking = true;
    }
  }

  window.addEventListener("scroll", updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  /* ============================================================
     6. SCROLL REVEAL  — Intersection Observer
     ============================================================ */
  const revealElements = document.querySelectorAll(
    ".reveal-up, .reveal-left, .reveal-right",
  );

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target); // trigger once
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      },
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach((el) => el.classList.add("visible"));
  }

  /* ============================================================
     7. ANIMATED COUNTERS
     ============================================================ */
  const counters = document.querySelectorAll(".stat-num[data-target]");

  /**
   * Animates a numeric counter from 0 to its data-target value.
   * @param {Element} el - The element containing the counter
   */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || "";
    const duration = 2000; // ms
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      el.textContent = current.toLocaleString("en-IN") + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toLocaleString("en-IN") + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 },
    );

    counters.forEach((counter) => counterObserver.observe(counter));
  } else {
    counters.forEach((counter) => animateCounter(counter));
  }

  /* ============================================================
     8. GALLERY FILTER
     ============================================================ */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Update active state
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;

      galleryItems.forEach((item) => {
        const category = item.dataset.category;
        if (filter === "all" || category === filter) {
          item.classList.remove("hidden");
        } else {
          item.classList.add("hidden");
        }
      });
    });
  });

  /* ============================================================
     9. LIGHTBOX
     ============================================================ */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");
  const lightboxCaption = document.getElementById("lightboxCaption");

  let currentLightboxIndex = 0;
  const lightboxImages = [];

  // Build image list
  galleryItems.forEach((item, index) => {
    const img = item.querySelector("img");
    const caption = item.querySelector(".gallery-overlay-content span");
    if (img) {
      lightboxImages.push({
        src: img.src,
        alt: img.alt,
        caption: caption ? caption.textContent : "",
      });
    }

    item.addEventListener("click", () => {
      if (item.classList.contains("hidden")) return;
      currentLightboxIndex = index;
      openLightbox(index);
    });

    // Keyboard support
    item.setAttribute("tabindex", "0");
    item.setAttribute("role", "button");
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (!item.classList.contains("hidden")) openLightbox(index);
      }
    });
  });

  function openLightbox(index) {
    console.log("📸 openLightbox called with index:", index);
    if (!lightbox || !lightboxImages[index]) {
      console.log("⚠️ Lightbox or image not found");
      return;
    }
    const data = lightboxImages[index];
    lightboxImg.src = data.src;
    lightboxImg.alt = data.alt;
    lightboxCaption.textContent = data.caption;
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    lightboxClose.focus();
    console.log("✅ Lightbox opened");
  }

  function closeLightbox() {
    console.log("❌ closeLightbox called");
    if (!lightbox) {
      console.log("⚠️ Lightbox element not found");
      return;
    }
    lightbox.hidden = true;
    lightboxImg.src = "";
    document.body.style.overflow = "";
    console.log("✅ Lightbox closed");
  }

  function showLightboxImage(index) {
    // Skip hidden gallery items
    let attempts = 0;
    while (
      galleryItems[index] &&
      galleryItems[index].classList.contains("hidden")
    ) {
      index = (index + 1) % lightboxImages.length;
      attempts++;
      if (attempts > lightboxImages.length) break;
    }
    currentLightboxIndex = index;
    const data = lightboxImages[index];
    if (!data) return;
    lightboxImg.src = data.src;
    lightboxImg.alt = data.alt;
    lightboxCaption.textContent = data.caption;
  }

  if (lightboxClose) {
    console.log("✅ Adding click listener to lightboxClose");
    lightboxClose.addEventListener("click", closeLightbox);
  } else {
    console.log("⚠️ lightboxClose element not found");
  }

  if (lightboxPrev) {
    console.log("✅ Adding click listener to lightboxPrev");
    lightboxPrev.addEventListener("click", () => {
      console.log("⬅️ Lightbox prev clicked");
      currentLightboxIndex =
        (currentLightboxIndex - 1 + lightboxImages.length) %
        lightboxImages.length;
      showLightboxImage(currentLightboxIndex);
    });
  }

  if (lightboxNext) {
    console.log("✅ Adding click listener to lightboxNext");
    lightboxNext.addEventListener("click", () => {
      console.log("➡️ Lightbox next clicked");
      currentLightboxIndex = (currentLightboxIndex + 1) % lightboxImages.length;
      showLightboxImage(currentLightboxIndex);
    });
  }

  // Close on backdrop click
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!lightbox || lightbox.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") {
      currentLightboxIndex =
        (currentLightboxIndex - 1 + lightboxImages.length) %
        lightboxImages.length;
      showLightboxImage(currentLightboxIndex);
    }
    if (e.key === "ArrowRight") {
      currentLightboxIndex = (currentLightboxIndex + 1) % lightboxImages.length;
      showLightboxImage(currentLightboxIndex);
    }
  });

  /* ============================================================
     10. TESTIMONIAL SLIDER
     ============================================================ */
  const testimonialTrack = document.getElementById("testimonialTrack");
  const sliderPrev = document.getElementById("sliderPrev");
  const sliderNext = document.getElementById("sliderNext");
  const sliderDotsWrap = document.getElementById("sliderDots");

  if (testimonialTrack) {
    const cards = testimonialTrack.querySelectorAll(".testimonial-card");
    let currentSlide = 0;
    let slidesPerView = getSlidesPerView();
    let totalSlides = Math.ceil(cards.length / slidesPerView);
    let autoSlideTimer = null;

    function getSlidesPerView() {
      if (window.innerWidth <= 600) return 1;
      if (window.innerWidth <= 900) return 2;
      return 3;
    }

    function buildDots() {
      if (!sliderDotsWrap) return;
      sliderDotsWrap.innerHTML = "";
      totalSlides = Math.ceil(cards.length / slidesPerView);
      for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement("button");
        dot.className = "slider-dot" + (i === 0 ? " active" : "");
        dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
        dot.setAttribute("role", "tab");
        dot.setAttribute("aria-selected", String(i === 0));
        dot.addEventListener("click", () => goToSlide(i));
        sliderDotsWrap.appendChild(dot);
      }
    }

    function goToSlide(index) {
      currentSlide = Math.max(0, Math.min(index, totalSlides - 1));

      const cardWidth = cards[0].offsetWidth + 24; // card width + gap
      const offset = currentSlide * slidesPerView * cardWidth;
      testimonialTrack.style.transform = `translateX(-${offset}px)`;

      // Update dots
      const dots = sliderDotsWrap
        ? sliderDotsWrap.querySelectorAll(".slider-dot")
        : [];
      dots.forEach((d, i) => {
        d.classList.toggle("active", i === currentSlide);
        d.setAttribute("aria-selected", String(i === currentSlide));
      });
    }

    function nextSlide() {
      const next = (currentSlide + 1) % totalSlides;
      goToSlide(next);
    }

    function prevSlide() {
      const prev = (currentSlide - 1 + totalSlides) % totalSlides;
      goToSlide(prev);
    }

    function startAutoSlide() {
      stopAutoSlide();
      autoSlideTimer = setInterval(nextSlide, 4500);
    }

    function stopAutoSlide() {
      if (autoSlideTimer) clearInterval(autoSlideTimer);
    }

    if (sliderNext)
      sliderNext.addEventListener("click", () => {
        nextSlide();
        resetAuto();
      });
    if (sliderPrev)
      sliderPrev.addEventListener("click", () => {
        prevSlide();
        resetAuto();
      });

    function resetAuto() {
      stopAutoSlide();
      startAutoSlide();
    }

    // Touch/swipe support
    let touchStartX = 0;
    testimonialTrack.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.touches[0].clientX;
      },
      { passive: true },
    );
    testimonialTrack.addEventListener("touchend", (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? nextSlide() : prevSlide();
        resetAuto();
      }
    });

    // Pause on hover
    testimonialTrack.addEventListener("mouseenter", stopAutoSlide);
    testimonialTrack.addEventListener("mouseleave", startAutoSlide);

    // Handle resize
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const newSPV = getSlidesPerView();
        if (newSPV !== slidesPerView) {
          slidesPerView = newSPV;
          currentSlide = 0;
          buildDots();
          goToSlide(0);
        }
      }, 200);
    });

    // Initialise
    buildDots();
    goToSlide(0);
    startAutoSlide();
  }

  /* ============================================================
     11. BACK TO TOP BUTTON
     ============================================================ */
  const backToTop = document.getElementById("backToTop");
  console.log("BackToTop button:", backToTop);

  function handleBackToTop() {
    if (!backToTop) return;
    if (window.scrollY > 500) {
      backToTop.classList.add("visible");
    } else {
      backToTop.classList.remove("visible");
    }
  }

  if (backToTop) {
    console.log("✅ Adding click listener to backToTop");
    backToTop.addEventListener("click", () => {
      console.log("⬆️ Back to top clicked!");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  } else {
    console.log("⚠️ backToTop button not found!");
  }

  window.addEventListener("scroll", handleBackToTop, { passive: true });
  handleBackToTop();

  /* ============================================================
     12. FOOTER — CURRENT YEAR
     ============================================================ */
  const yearEl = document.getElementById("currentYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ============================================================
     13. PARALLAX — Subtle hero background parallax on scroll
     ============================================================ */
  const heroImg = document.querySelector(".hero-img");

  if (
    heroImg &&
    window.matchMedia("(prefers-reduced-motion: no-preference)").matches
  ) {
    let ticking = false;

    function handleParallax() {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.scrollY;
          if (scrolled < window.innerHeight) {
            heroImg.style.transform = `scale(1) translateY(${scrolled * 0.2}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }
    window.addEventListener("scroll", handleParallax, { passive: true });
  }

  /* ============================================================
     14. BUTTON RIPPLE EFFECT
     ============================================================ */
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      // The CSS ::after handles the visual ripple.
      // This just resets it for re-triggering.
      this.classList.remove("rippling");
      void this.offsetWidth; // reflow trick
      this.classList.add("rippling");
    });
  });

  /* ============================================================
     15. LAZY LOAD IMAGES — for browsers without native support
     ============================================================ */
  if ("loading" in HTMLImageElement.prototype) {
    // Native lazy loading is supported — nothing extra needed
  } else {
    // Fallback: IntersectionObserver polyfill
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if ("IntersectionObserver" in window) {
      const imgObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute("data-src");
            }
            imgObserver.unobserve(img);
          }
        });
      });
      lazyImages.forEach((img) => imgObserver.observe(img));
    } else {
      lazyImages.forEach((img) => {
        if (img.dataset.src) img.src = img.dataset.src;
      });
    }
  }

  /* ============================================================
     16. HEADER — Close nav on outside click (mobile)
     ============================================================ */
  document.addEventListener("click", (e) => {
    if (!navbar) return;
    const isMenuOpen = navLinks && navLinks.classList.contains("open");
    if (isMenuOpen && !navbar.contains(e.target)) {
      closeMenu();
    }
  });

  /* ============================================================
     17. SERVICE CARDS — Mouse tilt micro-interaction (desktop)
     ============================================================ */
  if (window.matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll(".service-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const tiltX = (-y * 8).toFixed(2);
        const tiltY = (x * 8).toFixed(2);
        card.style.transform = `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  /* ============================================================
     DEBUG: Global click test
     ============================================================ */
  console.log("✅ Setting up global click test...");
  document.addEventListener("click", (e) => {
    console.log("🖱️ CLICK DETECTED!", e.target);
  });

  console.log("✅ All event listeners set up successfully!");
}); // end DOMContentLoaded
