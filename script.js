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

// Scenario list: load from JSON, render into list, filter (scenarios.html)
(function () {
  const filter = document.getElementById("scenario-filter");
  const listEl = document.getElementById("run-list");
  if (!filter || !listEl) return;

  const systemBoxes = filter.querySelectorAll('.filter__chips input[type="checkbox"]');
  const r18Toggle = document.getElementById("filter-r18");
  const clearBtn = document.getElementById("filter-clear");
  const countEl = document.getElementById("filter-count");
  const emptyEl = document.getElementById("run-empty");
  const stateEl = document.getElementById("run-state");
  const src = listEl.dataset.src || "scenarios.json";

  const esc = (s) =>
    String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const renderItem = (s) => {
    const meta = Array.isArray(s.meta) && s.meta.length
      ? `<p class="run-item__meta">${s.meta.map((m) => `<span>${esc(m)}</span>`).join("")}</p>`
      : "";

    if (s.placeholder) {
      return `<article class="run-item run-item--placeholder" data-always="true" aria-hidden="false">
          <div class="run-item__system">${esc(s.systemLabel || "更多系統")}</div>
          <div class="run-item__body">
            <h3 class="run-item__title">${esc(s.title)}</h3>
            ${meta}
            ${s.desc ? `<p class="run-item__desc">${esc(s.desc)}</p>` : ""}
          </div>
          <div class="run-item__status run-item__status--muted">
            <span class="status-dot status-dot--muted"></span>
            <span>${esc(s.status || "預留")}</span>
          </div>
        </article>`;
    }

    const cls = ["run-item"];
    if (s.active) cls.push("run-item--active");
    if (s.r18) cls.push("run-item--warn");
    if (s.link) cls.push("run-item--link");

    const tag = s.link ? "a" : "article";
    const linkAttrs = s.link
      ? ` href="${esc(s.link)}" target="_blank" rel="noopener"`
      : "";

    const titleBlock = s.badge
      ? `<div class="run-item__title-row">
          <h3 class="run-item__title">${esc(s.title)}</h3>
          <span class="run-item__badge">${esc(s.badge)}</span>
        </div>`
      : `<h3 class="run-item__title">${esc(s.title)}</h3>`;

    const warn = s.warn
      ? `<p class="run-item__warn"><strong>⚠ 嚴正提醒：</strong>${esc(s.warn)}</p>`
      : "";

    return `<${tag} class="${cls.join(" ")}"${linkAttrs} data-system="${esc(s.system)}" data-r18="${s.r18 ? "true" : "false"}">
        <div class="run-item__system">${esc(s.systemLabel || s.system)}</div>
        <div class="run-item__body">
          ${titleBlock}
          ${meta}
          ${s.desc ? `<p class="run-item__desc">${esc(s.desc)}</p>` : ""}
          ${warn}
        </div>
        <div class="run-item__status">
          <span class="status-dot"></span>
          <span>${esc(s.status || "可開團")}</span>
        </div>
      </${tag}>`;
  };

  const apply = () => {
    const checked = new Set(
      Array.from(systemBoxes).filter((b) => b.checked).map((b) => b.value)
    );
    const showR18 = r18Toggle && r18Toggle.checked;
    const items = listEl.querySelectorAll(".run-item");

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

  const collator =
    typeof Intl !== "undefined" && Intl.Collator
      ? new Intl.Collator("zh-Hant-u-co-stroke", { numeric: true })
      : null;
  const compareTitle = (a, b) => {
    const at = a.title || "";
    const bt = b.title || "";
    return collator ? collator.compare(at, bt) : at.localeCompare(bt);
  };

  const sortScenarios = (data) => {
    const placeholders = data.filter((x) => x.placeholder);
    const items = data
      .filter((x) => !x.placeholder)
      .sort((a, b) => {
        if (!!a.active !== !!b.active) return a.active ? -1 : 1;
        return compareTitle(a, b);
      });
    return items.concat(placeholders);
  };

  fetch(src, { cache: "no-store" })
    .then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then((data) => {
      if (!Array.isArray(data)) throw new Error("scenarios.json must be an array");
      listEl.innerHTML = sortScenarios(data).map(renderItem).join("");
      apply();
    })
    .catch((err) => {
      if (stateEl) {
        stateEl.classList.add("run-state--error");
        stateEl.textContent = `劇本資料載入失敗（${err.message}）。若以 file:// 開啟請改用本地 HTTP 伺服器或透過 GitHub Pages 瀏覽。`;
      }
      if (countEl) countEl.textContent = "";
      // eslint-disable-next-line no-console
      console.error("[scenarios]", err);
    });
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
