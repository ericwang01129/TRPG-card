// Reveal on scroll
(function () {
  const els = document.querySelectorAll(
    ".section, .card, .run-item, .link-card, .hero__text, .hero__portrait"
  );
  els.forEach((el) => el.classList.add("reveal"));

  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  els.forEach((el) => io.observe(el));
})();

// Subtle parallax on background
(function () {
  const layer = document.querySelector(".bg-layer");
  if (!layer) return;
  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY * 0.08;
        layer.style.transform = `scale(1.03) translateY(${y}px)`;
        ticking = false;
      });
    },
    { passive: true }
  );
})();
