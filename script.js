// ── Hamburger / mobile nav ──────────────────────────────────────────────────
const hamburger = document.getElementById("nav-hamburger");
const nav = document.querySelector(".nav");
const topbar = document.querySelector(".topbar");

function closeMobileNav() {
  hamburger.setAttribute("aria-expanded", "false");
  nav.classList.remove("nav-open");
}

hamburger.addEventListener("click", () => {
  const isOpen = hamburger.getAttribute("aria-expanded") === "true";
  hamburger.setAttribute("aria-expanded", String(!isOpen));
  nav.classList.toggle("nav-open", !isOpen);
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    closeMobileNav();
  });
});

document.addEventListener("click", (e) => {
  if (!hamburger.contains(e.target) && !nav.contains(e.target)) {
    closeMobileNav();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 840) {
    closeMobileNav();
  }
});

// ── Scroll: topbar shadow + active nav link ─────────────────────────────────
const navLinks = nav.querySelectorAll("a[href^='#']");
const sections = Array.from(navLinks)
  .map((l) => document.querySelector(l.getAttribute("href")))
  .filter(Boolean);

function updateNav() {
  // Scrolled class for navbar shadow intensification
  topbar.classList.toggle("scrolled", window.scrollY > 40);

  // Active section highlight
  const scrollMid = window.scrollY + window.innerHeight / 2;
  let active = sections[0];
  sections.forEach((s) => {
    if (s.offsetTop <= scrollMid) active = s;
  });

  navLinks.forEach((l) => {
    l.classList.toggle(
      "active",
      l.getAttribute("href") === `#${active.id}`
    );
  });
}

window.addEventListener("scroll", updateNav, { passive: true });
updateNav();

// ── Scroll-reveal animations ────────────────────────────────────────────────
const revealNodes = document.querySelectorAll(
  ".hero-copy > *, .portrait-panel, .section-heading, .feature-card, .skill-card, .service-card, .timeline-card, .project-hero, .project-card, .contact-copy, .contact-item",
);

function setupRevealAnimations() {
  revealNodes.forEach((node, index) => {
    node.setAttribute("data-reveal", "");
    node.style.setProperty("--reveal-delay", `${Math.min(index * 45, 220)}ms`);
  });

  if (!("IntersectionObserver" in window)) {
    revealNodes.forEach((node) => node.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -60px 0px" },
  );

  revealNodes.forEach((node) => observer.observe(node));
}

setupRevealAnimations();
