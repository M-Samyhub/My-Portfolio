const hamburger = document.getElementById("nav-hamburger");
const nav = document.querySelector(".nav");
const topbar = document.querySelector(".topbar");
const brand = document.querySelector(".brand");
const homeSection = document.getElementById("home");
const navLinks = Array.from(nav.querySelectorAll("a[href^='#']"));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

function getTopbarOffset() {
  return topbar.getBoundingClientRect().height + 24;
}

function scrollToSection(targetSelector) {
  const target = document.querySelector(targetSelector);
  if (!target) return;

  const offset = getTopbarOffset();
  const top = target.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({
    top: Math.max(0, top),
    behavior: "smooth"
  });
}

function closeMobileNav() {
  hamburger.setAttribute("aria-expanded", "false");
  nav.classList.remove("nav-open");
}

function openBrandToHome() {
  brand.classList.add("is-expanded");
  scrollToSection("#home");
}

brand.addEventListener("click", (event) => {
  event.preventDefault();
  openBrandToHome();
});

hamburger.addEventListener("click", () => {
  const isOpen = hamburger.getAttribute("aria-expanded") === "true";
  hamburger.setAttribute("aria-expanded", String(!isOpen));
  nav.classList.toggle("nav-open", !isOpen);
});

document.querySelectorAll("a[href^='#'], [data-scroll-target]").forEach((element) => {
  const selector = element.getAttribute("href") || element.dataset.scrollTarget;
  if (!selector || selector === "#") return;

  element.addEventListener("click", (event) => {
    if (element === brand) return;
    event.preventDefault();
    closeMobileNav();
    scrollToSection(selector);
  });
});

document.addEventListener("click", (event) => {
  if (!hamburger.contains(event.target) && !nav.contains(event.target)) {
    closeMobileNav();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 840) {
    closeMobileNav();
  }
  updateNavState();
});

function updateNavState() {
  topbar.classList.toggle("scrolled", window.scrollY > 40);

  const offset = getTopbarOffset();
  const scrollPosition = window.scrollY + offset + 10;
  const homeBottom = homeSection.offsetTop + homeSection.offsetHeight - offset;

  let activeId = null;

  if (scrollPosition > homeBottom) {
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - offset;
      const sectionBottom = sectionTop + section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        activeId = section.id;
      }
    });
  }

  if (scrollPosition <= homeBottom) {
    activeId = null;
  }

  if (scrollPosition <= homeBottom) {
    brand.classList.add("is-expanded");
  } else {
    brand.classList.remove("is-expanded");
  }

  navLinks.forEach((link) => {
    link.classList.toggle("active", activeId === link.getAttribute("href").slice(1));
  });
}

window.addEventListener("scroll", updateNavState, { passive: true });

const revealNodes = document.querySelectorAll(
  ".hero-copy > *, .portrait-panel, .section-heading, .feature-card, .skill-card, .service-card, .timeline-card, .project-hero, .project-card, .contact-copy, .contact-item"
);

function setupRevealAnimations() {
  revealNodes.forEach((node, index) => {
    node.setAttribute("data-reveal", "");
    node.style.setProperty("--reveal-delay", `${Math.min(index * 45, 260)}ms`);
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
    {
      threshold: 0.16,
      rootMargin: "0px 0px -60px 0px"
    }
  );

  revealNodes.forEach((node) => observer.observe(node));
}

setupRevealAnimations();
updateNavState();
