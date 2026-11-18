/* ==========================================================================
   It's okay to laugh. — shared site script
   - injects header + footer CTA (edit once, applies everywhere)
   - renders essay cards from ESSAYS (add new essays here)
   - sun graphics, scroll reveals, reading progress, Hebrew term tooltips
   ========================================================================== */

/* ---- Sign-up: paste your form endpoint here (Formspree, Mailchimp, ConvertKit,
   a Firebase Function, etc.). Leave empty and the form shows a "not connected" note. ---- */
const SIGNUP_ENDPOINT = "";

/* ---- Essays: the single source of truth for all essay cards ---- */
const ESSAYS = [
  {
    slug: "the-mystery-of-perfect-joy",
    title: "The Mystery of Perfect Joy",
    hook: "We spend the word “joy” like small change. The real thing hasn’t been seen since Eden — and it’s on its way back.",
    minutes: 9,
    tag: "Flagship essay",
    topic: "torah",
    color: "yellow",
    art: "smiles",
  },
  {
    slug: "dont-let-miserable-people-bring-you-down",
    title: "Don’t Let Miserable People Bring You Down",
    hook: "Misery is contagious. So is joy. You get to decide which one you catch — and which one you spread.",
    minutes: 6,
    tag: "Inspired by Dennis Prager",
    topic: "life",
    color: "coral",
    art: "sun",
  },
  {
    slug: "aviva-on-happiness",
    title: "Aviva on Happiness: No Complaining, No Sorrow",
    hook: "Two rules. Harder than they sound, simpler than you think, and older than you’d guess.",
    minutes: 5,
    tag: "Story",
    topic: "life",
    color: "blue",
    art: "rings",
  },
  {
    slug: "why-even-the-temple-times-werent-perfect-joy",
    title: "Why Even the Temple Times Weren’t Perfect Joy",
    hook: "At the very height of Jerusalem’s glory, the joy still came with an asterisk. That’s the good news.",
    minutes: 7,
    tag: "Torah",
    topic: "torah",
    color: "ink",
    art: "stars",
  },
];

/* ---------------------------------------------------------------------- */

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

function sunSVG({ face = true, label = "A smiling sun" } = {}) {
  const rays = Array.from({ length: 12 }, (_, i) =>
    `<rect x="186" y="6" width="28" height="74" rx="14" transform="rotate(${i * 30} 200 200)"/>`
  ).join("");
  const faceMarkup = face
    ? `<ellipse class="eye" cx="162" cy="182" rx="13" ry="19"/>
       <ellipse class="eye" cx="238" cy="182" rx="13" ry="19"/>
       <ellipse class="cheek" cx="132" cy="226" rx="20" ry="12"/>
       <ellipse class="cheek" cx="268" cy="226" rx="20" ry="12"/>
       <path class="smile" d="M146 222 Q200 284 254 222"/>`
    : "";
  return `<svg class="sun" viewBox="0 0 400 400" role="img" aria-label="${label}">
    <g class="rays">${rays}</g>
    <g class="face-wrap"><circle class="disc" cx="200" cy="200" r="112"/>${faceMarkup}</g>
  </svg>`;
}

function miniSun() {
  const rays = Array.from({ length: 8 }, (_, i) =>
    `<rect x="17" y="1" width="6" height="9" rx="3" fill="#FFC93C" transform="rotate(${i * 45} 20 20)"/>`
  ).join("");
  return `<svg viewBox="0 0 40 40" aria-hidden="true"><g class="rays">${rays}</g>
    <circle cx="20" cy="20" r="10" fill="#FFC93C"/>
    <path d="M15.5 21.5 Q20 26 24.5 21.5" fill="none" stroke="#1A1A1A" stroke-width="2.2" stroke-linecap="round"/></svg>`;
}

/* Decorative art for color blocks */
function blockArt(kind, color) {
  const ink = "#1A1A1A", cream = "#FFF8EC", yellow = "#FFC93C", coral = "#FF6B6B", blue = "#4A7CFF";
  const line = color === "ink" || color === "blue" ? cream : ink;
  switch (kind) {
    case "smiles":
      return `<svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        ${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${-60 + i * 0} ${60 + i * 62} Q300 ${220 + i * 62} 660 ${60 + i * 62}" fill="none" stroke="${line}" stroke-width="10" stroke-linecap="round" opacity="${0.9 - i * 0.12}"/>`).join("")}
        <circle cx="470" cy="110" r="54" fill="${coral}" stroke="${ink}" stroke-width="5"/></svg>`;
    case "sun":
      return `<svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g transform="translate(420 150)">${Array.from({ length: 16 }, (_, i) => `<rect x="-9" y="-190" width="18" height="70" rx="9" fill="${yellow}" transform="rotate(${i * 22.5})"/>`).join("")}
        <circle r="100" fill="${yellow}" stroke="${ink}" stroke-width="5"/>
        <path d="M-40 10 Q0 55 40 10" fill="none" stroke="${ink}" stroke-width="9" stroke-linecap="round"/>
        <circle cx="-30" cy="-22" r="9" fill="${ink}"/><circle cx="30" cy="-22" r="9" fill="${ink}"/></g></svg>`;
    case "rings":
      return `<svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        ${[260, 210, 160, 110, 60].map((r, i) => `<circle cx="160" cy="420" r="${r}" fill="${i % 2 ? blue : cream}" opacity="${i % 2 ? 1 : 0.18 + i * 0.05}"/>`).join("")}
        <circle cx="470" cy="120" r="44" fill="${yellow}" stroke="${ink}" stroke-width="5"/>
        <path d="M450 128 Q470 150 490 128" fill="none" stroke="${ink}" stroke-width="6" stroke-linecap="round"/></svg>`;
    case "stars":
      return `<svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        ${[[90, 80, 1], [520, 60, .7], [380, 300, 1.2], [180, 300, .6], [300, 120, .5], [560, 260, .9]].map(([x, y, s]) =>
          `<path transform="translate(${x} ${y}) scale(${s})" d="M0 -40 C6 -8 8 -6 40 0 C8 6 6 8 0 40 C-6 8 -8 6 -40 0 C-8 -6 -6 -8 0 -40Z" fill="${yellow}"/>`).join("")}
        <path d="M120 400 Q300 170 480 400" fill="none" stroke="${coral}" stroke-width="12" stroke-linecap="round"/></svg>`;
  }
  return "";
}

function essayCard(e, { feature = false } = {}) {
  return `<a class="essay-card ${feature ? "feature" : ""} reveal" href="/essays/${e.slug}" data-topic="${e.topic}">
    <div class="block bg-${e.color}">${blockArt(e.art, e.color)}<span class="tag">${e.tag}</span></div>
    <div class="text">
      <h3>${e.title}</h3>
      <p>${e.hook}</p>
      <div class="meta"><span class="time">${e.minutes} min read</span><span class="read">Read <span>→</span></span></div>
    </div>
  </a>`;
}

/* ---- Header / footer ---- */
function renderChrome() {
  const path = location.pathname.replace(/\.html$/, "").replace(/\/$/, "") || "/";
  const is = p => (path === p || path.startsWith(p + "/")) ? ' aria-current="page"' : "";

  const header = $("[data-site-header]");
  if (header) {
    header.outerHTML = `
    <a class="skip-link" href="#main">Skip to content</a>
    <header class="site-header">
      <div class="wrap">
        <a class="brand" href="/" aria-label="It's okay to laugh — home">${miniSun()}<span>It’s okay to laugh<span class="dot">.</span></span></a>
        <button class="nav-toggle" aria-label="Menu" aria-expanded="false" aria-controls="site-nav"><span></span></button>
        <nav class="nav" id="site-nav" aria-label="Main">
          <a href="/essays"${is("/essays")}>Essays</a>
          <a href="/practices"${is("/practices")}>Practices</a>
          <a href="/about"${is("/about")}>The Quest</a>
          <a class="btn btn-small" href="#join">Join the quest</a>
        </nav>
      </div>
    </header>`;
  }

  const footer = $("[data-site-footer]");
  if (footer) {
    footer.outerHTML = `
    <section class="cta" id="join" aria-labelledby="cta-title">
      <svg class="smile-arc" viewBox="0 0 1000 500" aria-hidden="true">
        <path d="M60 60 Q500 560 940 60" fill="none" stroke="#FFF8EC" stroke-width="28" stroke-linecap="round"/>
      </svg>
      <div class="wrap">
        <p class="eyebrow">The newsletter</p>
        <h2 id="cta-title">One day, joy will be our <em>currency.</em></h2>
        <p class="join">Join the quest.</p>
        <form class="signup" novalidate>
          <label class="sr-only" for="signup-email">Email address</label>
          <input id="signup-email" type="email" name="email" placeholder="you@somewhere.joy" autocomplete="email" required>
          <button class="btn" type="submit">Count me in <span class="arrow">→</span></button>
        </form>
        <p class="signup-msg" role="status" aria-live="polite"></p>
      </div>
    </section>
    <footer class="site-footer">
      <div class="wrap">
        <div>
          <a class="brand" href="/">${miniSun()}<span>It’s okay to laugh<span class="dot">.</span></span></a>
          <p class="tagline">Joy is a serious practice.</p>
          <small>© ${new Date().getFullYear()} It’s okay to laugh. Made with a straight face.</small>
        </div>
        <nav aria-label="Footer">
          <a href="/essays">Essays</a>
          <a href="/practices">Practices</a>
          <a href="/about">The Quest</a>
          <a href="#join">Newsletter</a>
        </nav>
      </div>
    </footer>`;
  }

  const hdr = $(".site-header");
  if (hdr) {
    const toggle = $(".nav-toggle");
    toggle.addEventListener("click", () => {
      const open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open);
    });
    $$(".nav a").forEach(a => a.addEventListener("click", () => {
      document.body.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
    }));
    const onScroll = () => hdr.classList.toggle("scrolled", scrollY > 8);
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
}

/* ---- Suns ---- */
function renderSuns() {
  $$("[data-sun]").forEach(el => {
    el.innerHTML = sunSVG({ face: el.dataset.sun !== "plain", label: el.dataset.label || "A smiling sun" });
  });
  $$(".sun").forEach(sun => {
    const laugh = () => {
      sun.classList.remove("laughing");
      void sun.getBoundingClientRect();
      sun.classList.add("laughing");
      const smile = $(".smile", sun);
      if (smile) {
        smile.setAttribute("d", "M140 214 Q200 310 260 214 Z");
        smile.style.fill = "#1A1A1A";
      }
      clearTimeout(sun._t);
      sun._t = setTimeout(() => {
        sun.classList.remove("laughing");
        if (smile) { smile.setAttribute("d", "M146 222 Q200 284 254 222"); smile.style.fill = ""; }
      }, 1600);
    };
    sun.addEventListener("click", laugh);
    sun.laugh = laugh;
  });
}

/* ---- Essay grids ---- */
function renderEssayGrids() {
  $$("[data-essays]").forEach(grid => {
    const mode = grid.dataset.essays; // "home" | "all" | "next"
    let list = ESSAYS;
    if (mode === "next") {
      const current = grid.dataset.current;
      const idx = ESSAYS.findIndex(e => e.slug === current);
      list = [ESSAYS[(idx + 1) % ESSAYS.length], ESSAYS[(idx + 2) % ESSAYS.length]];
      grid.innerHTML = list.map(e => essayCard(e)).join("");
      return;
    }
    grid.innerHTML = list.map((e, i) => essayCard(e, { feature: i === 0 })).join("") +
      (mode === "all" ? `<div class="essay-card soon reveal"><div><h3>More joy<br>in the oven.</h3><p style="margin:12px auto 0">New essays arrive with the newsletter.</p><a class="btn btn-small" href="#join">Get them first</a></div></div>` : "");
  });

  // Filters on the Essays page
  const filters = $(".filters");
  if (filters) {
    filters.addEventListener("click", ev => {
      const chip = ev.target.closest(".chip");
      if (!chip) return;
      $$(".chip", filters).forEach(c => c.setAttribute("aria-pressed", c === chip));
      const t = chip.dataset.filter;
      $$("[data-topic]").forEach(card => {
        card.style.display = t === "all" || card.dataset.topic === t ? "" : "none";
      });
    });
  }
}

/* ---- Scroll reveals ---- */
function initReveals() {
  const els = $$(".reveal");
  if (!("IntersectionObserver" in window)) { els.forEach(e => e.classList.add("in")); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  els.forEach(e => io.observe(e));
}

/* ---- Essay page niceties ---- */
function initEssay() {
  $$("[data-art]").forEach(el => { el.innerHTML = blockArt(el.dataset.art, el.dataset.color); });
  const bar = $(".progress");
  const article = $(".prose");
  if (bar && article) {
    const update = () => {
      const r = article.getBoundingClientRect();
      const total = r.height - innerHeight * 0.6;
      const pct = Math.min(1, Math.max(0, -r.top / total));
      bar.style.width = (pct * 100) + "%";
    };
    addEventListener("scroll", update, { passive: true });
    update();
  }

  // Tap-to-open tooltips on touch devices
  $$(".heb").forEach(h => {
    h.setAttribute("tabindex", "0");
    h.addEventListener("click", e => {
      e.stopPropagation();
      const wasOpen = h.classList.contains("open");
      $$(".heb.open").forEach(o => o.classList.remove("open"));
      if (!wasOpen) h.classList.add("open");
    });
  });
  document.addEventListener("click", () => $$(".heb.open").forEach(o => o.classList.remove("open")));

  const share = $("[data-share]");
  if (share) {
    share.addEventListener("click", async () => {
      const data = { title: document.title, url: location.href };
      try {
        if (navigator.share) await navigator.share(data);
        else { await navigator.clipboard.writeText(location.href); share.textContent = "Link copied ✓"; }
      } catch (_) { /* user cancelled */ }
    });
  }
}

/* ---- Sign-up ---- */
function initSignup() {
  const form = $(".signup");
  if (!form) return;
  const msg = $(".signup-msg");
  form.addEventListener("submit", async ev => {
    ev.preventDefault();
    const email = form.email.value.trim();
    if (!/^\S+@\S+\.\S+$/.test(email)) { msg.textContent = "That email looks a little too creative. Try again?"; return; }
    if (!SIGNUP_ENDPOINT) {
      msg.textContent = "Sign-ups aren’t connected yet — check back very soon.";
      console.warn("Set SIGNUP_ENDPOINT in /assets/js/main.js to collect emails.");
      return;
    }
    msg.textContent = "Sending…";
    try {
      const res = await fetch(SIGNUP_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error(res.status);
      form.reset();
      msg.textContent = "You’re in. Welcome to the quest ☀";
      $$(".sun").forEach(s => s.laugh && s.laugh());
    } catch (_) {
      msg.textContent = "Something went wrong on our end. Please try again.";
    }
  });
}

renderChrome();
renderSuns();
renderEssayGrids();
initReveals();
initEssay();
initSignup();
