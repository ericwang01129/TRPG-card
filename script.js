// Mobile nav toggle
(function () {
  const btn = document.querySelector(".nav__toggle");
  const menu = document.getElementById("primary-nav");
  if (!btn || !menu) return;

  const close = () => {
    menu.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-label", "開啟選單");
  };
  const open = () => {
    menu.classList.add("is-open");
    btn.setAttribute("aria-expanded", "true");
    btn.setAttribute("aria-label", "關閉選單");
  };

  btn.addEventListener("click", () => {
    if (menu.classList.contains("is-open")) close();
    else open();
  });

  menu.addEventListener("click", (e) => {
    if (e.target.tagName === "A") close();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 960) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
})();

// Scenario filter (scenarios.html)
(function () {
  const filter = document.getElementById("scenario-filter");
  if (!filter) return;

  const systemBoxes = filter.querySelectorAll('.filter__chips input[type="checkbox"]');
  const r18Toggle = document.getElementById("filter-r18");
  const clearBtn = document.getElementById("filter-clear");
  const countEl = document.getElementById("filter-count");
  const emptyEl = document.getElementById("run-empty");
  const items = document.querySelectorAll(".run-item");

  const apply = () => {
    const checked = new Set(
      Array.from(systemBoxes).filter((b) => b.checked).map((b) => b.value)
    );
    const showR18 = r18Toggle.checked;

    let visible = 0;
    items.forEach((el) => {
      if (el.dataset.always === "true") {
        el.classList.remove("is-hidden");
        return;
      }
      const sys = el.dataset.system;
      const isR18 = el.dataset.r18 === "true";
      const matchSys = checked.has(sys);
      const matchR18 = showR18 || !isR18;
      const show = matchSys && matchR18;
      el.classList.toggle("is-hidden", !show);
      if (show) visible += 1;
    });

    if (countEl) {
      countEl.textContent = visible === 0 ? "" : `${visible} 項符合條件`;
    }
    if (emptyEl) {
      emptyEl.classList.toggle("is-visible", visible === 0);
    }
  };

  systemBoxes.forEach((b) => b.addEventListener("change", apply));
  if (r18Toggle) r18Toggle.addEventListener("change", apply);
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      const allChecked = Array.from(systemBoxes).every((b) => b.checked);
      systemBoxes.forEach((b) => (b.checked = !allChecked));
      apply();
    });
  }

  apply();
})();

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
