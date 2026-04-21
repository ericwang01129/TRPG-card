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

// Discord: open DM in native app, fallback to web profile
(function () {
  const el = document.getElementById("discord-link");
  if (!el) return;
  const userId = el.dataset.discordId;
  const webUrl = `https://discord.com/users/${userId}`;
  const appUrl = `discord://-/users/${userId}`;

  el.addEventListener("click", (e) => {
    e.preventDefault();
    // Try native app first
    const hidden = document.createElement("iframe");
    hidden.style.display = "none";
    hidden.src = appUrl;
    document.body.appendChild(hidden);

    // Fallback to web after a short delay (app handler takes priority if installed)
    const fallback = setTimeout(() => {
      window.open(webUrl, "_blank", "noopener");
    }, 600);

    // If the tab loses focus quickly, the app opened — cancel the web fallback
    const onBlur = () => {
      clearTimeout(fallback);
      window.removeEventListener("blur", onBlur);
    };
    window.addEventListener("blur", onBlur);

    setTimeout(() => hidden.remove(), 1500);
  });
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
