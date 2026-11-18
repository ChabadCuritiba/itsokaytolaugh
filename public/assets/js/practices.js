/* Serious Joy Practices — all state lives in this browser's localStorage. */
(() => {
  const $ = s => document.querySelector(s);
  const store = {
    get(k, d) { try { const v = localStorage.getItem("joy:" + k); return v ? JSON.parse(v) : d; } catch (_) { return d; } },
    set(k, v) { try { localStorage.setItem("joy:" + k, JSON.stringify(v)); } catch (_) { /* private mode */ } },
  };

  /* ---------- 1. Laugh reset ---------- */
  const PROMPTS = [
    "Smile. Just the corners of your mouth. That’s it.",
    "Breathe in deep. On the way out — a soft “ha.”",
    "Now “ha-ha.” Fake it. Your body can’t tell.",
    "“Ha-ha-ha!” Shoulders down, belly loose.",
    "Picture the most ridiculous thing that happened this week.",
    "Let it go wherever it wants to go. Louder is allowed.",
  ];
  const startBtn = $("#laugh-start");
  if (startBtn) {
    const fg = $(".ring-fg"), count = $(".count"), prompt = $(".laugh-prompt"), stats = $("#laugh-stats");
    const C = 2 * Math.PI * 54;
    fg.style.strokeDasharray = C;
    fg.style.strokeDashoffset = 0;
    const showStats = () => {
      const n = store.get("laughs", 0);
      stats.textContent = n ? `You’ve reset ${n} time${n === 1 ? "" : "s"}. Keep going.` : "";
    };
    showStats();
    let timer = null;
    const setPrompt = t => {
      prompt.classList.add("fade");
      setTimeout(() => { prompt.textContent = t; prompt.classList.remove("fade"); }, 300);
    };
    const stop = (finished) => {
      clearInterval(timer); timer = null;
      startBtn.innerHTML = finished ? "Again! <span class='arrow'>↻</span>" : "Start the reset <span class='arrow'>→</span>";
      if (finished) {
        setPrompt("Reset complete. Now go be a lamp. ☀");
        store.set("laughs", store.get("laughs", 0) + 1);
        showStats();
        const sun = $(".timer .sun"); sun && sun.laugh && sun.laugh();
      } else {
        setPrompt("Paused. The sun will wait.");
      }
    };
    startBtn.addEventListener("click", () => {
      if (timer) return stop(false);
      let left = 60;
      fg.style.transition = "none"; fg.style.strokeDashoffset = 0;
      void fg.getBoundingClientRect(); fg.style.transition = "";
      count.textContent = "1:00";
      setPrompt(PROMPTS[0]);
      startBtn.textContent = "Pause";
      timer = setInterval(() => {
        left--;
        count.textContent = `0:${String(left).padStart(2, "0")}`;
        fg.style.strokeDashoffset = C * (1 - left / 60);
        if (left > 0 && left % 10 === 0) setPrompt(PROMPTS[(60 - left) / 10]);
        if (left % 10 === 5 && left < 40) { const s = $(".timer .sun"); s && s.laugh && s.laugh(); }
        if (left <= 0) stop(true);
      }, 1000);
    });
  }

  /* ---------- 2. No-complain experiment ---------- */
  const ncStart = $("#nc-start");
  if (ncStart) {
    const DAY = 864e5;
    const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime(); };
    const REFRAMES = [
      "“This line is so slow” → “Good — a few minutes to think.”",
      "“Nobody helps around here” → “Could you help me with this?”",
      "“Ugh, Monday” → “A whole new week to try again.”",
      "Turn the complaint into a request, a thank-you, or a gam zu l’tovah.",
      "Notice it, smile at yourself, start again. That’s the whole practice.",
    ];
    let s = store.get("nc", { start: null, best: 0, flips: 0, resets: 0 });
    const save = () => store.set("nc", s);
    const streak = () => (s.start ? Math.floor((today() - s.start) / DAY) : 0);

    const render = () => {
      const n = streak();
      s.best = Math.max(s.best, n);
      $("#nc-streak").textContent = n;
      $("#nc-unit").textContent = s.start ? (n === 1 ? "day without complaining" : "days without complaining") : "not started yet";
      $("#nc-best").textContent = s.best;
      $("#nc-flips").textContent = s.flips;
      $("#nc-resets").textContent = s.resets;
      const goal = n < 7 ? 7 : 21;
      $("#nc-days").innerHTML = Array.from({ length: goal }, (_, i) =>
        `<span class="${i < n ? "done" : i === n && s.start ? "today" : ""}">${i + 1}</span>`).join("");
      $("#nc-days").style.display = s.start ? "" : "none";
      ncStart.hidden = !!s.start;
      $("#nc-slip").hidden = $("#nc-flip").hidden = $("#nc-clear").hidden = !s.start;
      save();
    };
    ncStart.addEventListener("click", () => {
      s.start = today();
      $("#nc-msg").textContent = "Day one. Today counts once it’s over — so make it a clean one.";
      render();
    });
    $("#nc-slip").addEventListener("click", () => {
      s.start = today(); s.resets++;
      $("#nc-msg").textContent = "Caught it! That’s the hard part. Fresh start — " + REFRAMES[s.resets % REFRAMES.length];
      render();
    });
    $("#nc-flip").addEventListener("click", () => {
      s.flips++;
      $("#nc-msg").textContent = ["Beautiful. That’s the whole game.", "Flipped! Joy: 1, kvetching: 0.", "Look at you, rewiring your brain."][s.flips % 3];
      render();
    });
    $("#nc-clear").addEventListener("click", () => {
      if (!confirm("Clear your streak and stats?")) return;
      s = { start: null, best: 0, flips: 0, resets: 0 };
      $("#nc-msg").textContent = "Pro tip: a complaint is just a request that hasn’t been asked yet.";
      render();
    });
    render();
  }

  /* ---------- 3. Joy journal ---------- */
  const jText = $("#j-text");
  if (jText) {
    const JPROMPTS = [
      "What made you smile today that you almost didn’t notice?",
      "Who made your day lighter this week? Have you told them?",
      "What’s something you complained about that was secretly a blessing?",
      "Describe a moment today that was quietly perfect.",
      "What would today look like if joy were the currency?",
      "What’s a small thing you’re looking forward to tomorrow?",
      "When did you last laugh so hard it hurt? What happened?",
      "Name three things that are working in your life right now.",
      "What worry did you carry today that turned out to be nothing?",
      "If the Geulah came tomorrow, what would you be most excited to celebrate?",
      "What’s something you do that brings other people joy?",
      "Which sound, smell, or taste made you happy today?",
      "What hard thing are you grateful you went through?",
      "Who is the most joyful person you know? What do they do differently?",
      "Write one sentence of thanks to G‑d for something specific from today.",
    ];
    let pi = Math.floor(Date.now() / 864e5) % JPROMPTS.length; // prompt of the day
    const promptEl = $("#j-prompt");
    promptEl.textContent = JPROMPTS[pi];
    jText.value = store.get("draft", "");
    jText.addEventListener("input", () => store.set("draft", jText.value));

    const list = $("#j-entries");
    const esc = t => t.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const renderEntries = () => {
      const entries = store.get("journal", []);
      list.innerHTML = entries.slice().reverse().map(e =>
        `<li><small>${new Date(e.at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })} · ${esc(e.prompt)}</small>${esc(e.text)}</li>`).join("");
      $("#j-download").hidden = !entries.length;
    };
    renderEntries();

    $("#j-shuffle").addEventListener("click", () => {
      pi = (pi + 1 + Math.floor(Math.random() * (JPROMPTS.length - 1))) % JPROMPTS.length;
      promptEl.textContent = JPROMPTS[pi];
    });
    $("#j-save").addEventListener("click", () => {
      const text = jText.value.trim();
      if (!text) { jText.focus(); return; }
      const entries = store.get("journal", []);
      entries.push({ at: Date.now(), prompt: JPROMPTS[pi], text });
      store.set("journal", entries);
      jText.value = ""; store.set("draft", "");
      renderEntries();
      const b = $("#j-save"); b.textContent = "Saved ☀"; setTimeout(() => (b.textContent = "Save entry"), 1600);
    });
    $("#j-download").addEventListener("click", () => {
      const entries = store.get("journal", []);
      const body = entries.map(e => `${new Date(e.at).toLocaleString()}\n${e.prompt}\n\n${e.text}\n`).join("\n— — —\n\n");
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([body], { type: "text/plain" }));
      a.download = "my-joy-journal.txt";
      a.click();
      URL.revokeObjectURL(a.href);
    });
  }
})();
