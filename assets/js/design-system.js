/* ============================================================
   SANTO DOCE — Interações do Design System
   Vanilla JS, sem dependências além do Lucide (ícones).
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Ícones Lucide ---------- */
  function renderIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }

  /* ---------- ACCORDION / FAQ ---------- */
  function initAccordions() {
    document.querySelectorAll("[data-accordion]").forEach(function (root) {
      const single = root.getAttribute("data-accordion") === "single";
      root.querySelectorAll(".sd-accordion__trigger").forEach(function (trigger) {
        trigger.addEventListener("click", function () {
          const panel = document.getElementById(trigger.getAttribute("aria-controls"));
          const open = trigger.getAttribute("aria-expanded") === "true";
          if (single && !open) {
            root.querySelectorAll(".sd-accordion__trigger").forEach(function (t) {
              t.setAttribute("aria-expanded", "false");
              const p = document.getElementById(t.getAttribute("aria-controls"));
              if (p) p.style.maxHeight = null;
            });
          }
          trigger.setAttribute("aria-expanded", String(!open));
          panel.style.maxHeight = open ? null : panel.scrollHeight + "px";
        });
      });
    });
  }

  /* ---------- TABS ---------- */
  function initTabs() {
    document.querySelectorAll("[data-tabs]").forEach(function (root) {
      const triggers = root.querySelectorAll(".sd-tabs__trigger");
      triggers.forEach(function (trigger) {
        trigger.addEventListener("click", function () {
          triggers.forEach(function (t) { t.setAttribute("aria-selected", "false"); });
          root.querySelectorAll(".sd-tabs__panel").forEach(function (p) { p.hidden = true; });
          trigger.setAttribute("aria-selected", "true");
          const panel = document.getElementById(trigger.getAttribute("aria-controls"));
          if (panel) panel.hidden = false;
        });
      });
    });
  }

  /* ---------- DROPDOWN ---------- */
  function initDropdowns() {
    document.querySelectorAll("[data-dropdown]").forEach(function (root) {
      const btn = root.querySelector("[data-dropdown-trigger]");
      const menu = root.querySelector(".sd-dropdown__menu");
      if (!btn || !menu) return;
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        const open = menu.getAttribute("data-open") === "true";
        closeAllDropdowns();
        menu.setAttribute("data-open", String(!open));
        btn.setAttribute("aria-expanded", String(!open));
      });
    });
    document.addEventListener("click", closeAllDropdowns);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeAllDropdowns(); });
  }
  function closeAllDropdowns() {
    document.querySelectorAll(".sd-dropdown__menu[data-open='true']").forEach(function (m) {
      m.setAttribute("data-open", "false");
      const t = m.closest("[data-dropdown]").querySelector("[data-dropdown-trigger]");
      if (t) t.setAttribute("aria-expanded", "false");
    });
  }

  /* ---------- MODAL ---------- */
  function initModals() {
    document.querySelectorAll("[data-modal-open]").forEach(function (btn) {
      btn.addEventListener("click", function () { openOverlay(btn.getAttribute("data-modal-open")); });
    });
    document.querySelectorAll("[data-modal-close]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const ov = btn.closest(".sd-overlay");
        if (ov) closeOverlay(ov.id);
      });
    });
    document.querySelectorAll(".sd-overlay").forEach(function (ov) {
      ov.addEventListener("click", function (e) { if (e.target === ov) closeOverlay(ov.id); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        document.querySelectorAll(".sd-overlay[data-open='true']").forEach(function (ov) { closeOverlay(ov.id); });
      }
    });
  }
  function openOverlay(id) { const el = document.getElementById(id); if (el) { el.setAttribute("data-open", "true"); document.body.style.overflow = "hidden"; } }
  function closeOverlay(id) { const el = document.getElementById(id); if (el) { el.setAttribute("data-open", "false"); document.body.style.overflow = ""; } }

  /* ---------- DRAWER ---------- */
  function initDrawers() {
    document.querySelectorAll("[data-drawer-open]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const id = btn.getAttribute("data-drawer-open");
        const drawer = document.getElementById(id);
        const overlay = document.getElementById(id + "-overlay");
        if (drawer) drawer.setAttribute("data-open", "true");
        if (overlay) overlay.setAttribute("data-open", "true");
        document.body.style.overflow = "hidden";
      });
    });
    document.querySelectorAll("[data-drawer-close]").forEach(function (btn) {
      btn.addEventListener("click", function () { closeDrawer(btn.getAttribute("data-drawer-close")); });
    });
    document.querySelectorAll(".sd-drawer-overlay").forEach(function (ov) {
      ov.addEventListener("click", function () { closeDrawer(ov.id.replace("-overlay", "")); });
    });
  }
  function closeDrawer(id) {
    const drawer = document.getElementById(id);
    const overlay = document.getElementById(id + "-overlay");
    if (drawer) drawer.setAttribute("data-open", "false");
    if (overlay) overlay.setAttribute("data-open", "false");
    document.body.style.overflow = "";
  }

  /* ---------- TOAST ---------- */
  function ensureToastStack() {
    let stack = document.querySelector(".sd-toast-stack");
    if (!stack) { stack = document.createElement("div"); stack.className = "sd-toast-stack"; document.body.appendChild(stack); }
    return stack;
  }
  const ICONS = { success: "check-circle-2", error: "alert-circle", gold: "sparkles", info: "info" };
  window.sdToast = function (opts) {
    opts = opts || {};
    const type = opts.type || "info";
    const stack = ensureToastStack();
    const toast = document.createElement("div");
    toast.className = "sd-toast sd-toast--" + type;
    toast.setAttribute("role", "status");
    toast.innerHTML =
      '<i data-lucide="' + (ICONS[type] || "info") + '" class="sd-icon" style="color:var(--sd-primary);flex:none;width:22px;height:22px;margin-top:2px"></i>' +
      '<div style="flex:1"><div style="font-weight:600;color:var(--sd-text-primary)">' + (opts.title || "Notificação") + '</div>' +
      (opts.message ? '<div style="font-size:14px;color:var(--sd-text-secondary);margin-top:2px">' + opts.message + '</div>' : '') + '</div>' +
      '<button aria-label="Fechar" style="background:none;border:none;cursor:pointer;color:var(--sd-text-secondary)"><i data-lucide="x" style="width:18px;height:18px"></i></button>';
    stack.appendChild(toast);
    renderIcons();
    const remove = function () { toast.style.animation = "fade-in 200ms reverse forwards"; setTimeout(function () { toast.remove(); }, 200); };
    toast.querySelector("button").addEventListener("click", remove);
    setTimeout(remove, opts.duration || 4000);
  };
  function initToastDemos() {
    document.querySelectorAll("[data-toast]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        window.sdToast({
          type: btn.getAttribute("data-toast"),
          title: btn.getAttribute("data-toast-title") || "Tudo certo!",
          message: btn.getAttribute("data-toast-message") || "Sua ação foi concluída com sucesso.",
        });
      });
    });
  }

  /* ---------- SCROLLSPY (nav lateral) ---------- */
  function initScrollSpy() {
    const links = Array.from(document.querySelectorAll("[data-spy]"));
    if (!links.length) return;
    const sections = links.map(function (l) { return document.getElementById(l.getAttribute("data-spy")); }).filter(Boolean);
    const obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (l) { l.classList.toggle("is-active", l.getAttribute("data-spy") === entry.target.id); });
        }
      });
    }, { rootMargin: "-20% 0px -70% 0px" });
    sections.forEach(function (s) { obs.observe(s); });
  }

  /* ---------- REVEAL on scroll ---------- */
  function initReveal() {
    const els = document.querySelectorAll("[data-reveal]");
    if (!els.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach(function (el) { el.classList.add("is-revealed"); });
      return;
    }

    const obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18, rootMargin: "0px 0px -6% 0px" });

    els.forEach(function (el) {
      if (el.closest(".section-pains")) return;
      obs.observe(el);
    });
  }

  /* ---------- PAINS: reveal acompanha o scroll ---------- */
  function initPainsScrollReveal() {
    const stage = document.querySelector(".section-pains__stage");
    if (!stage) return;

    const bounceItems = Array.from(stage.querySelectorAll('[data-reveal="down"], [data-reveal="up"]'));
    const slideItems = Array.from(stage.querySelectorAll('[data-reveal="left"], [data-reveal="right"]'));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      bounceItems.concat(slideItems).forEach(function (el) {
        el.style.opacity = "1";
        el.style.transform = "";
        el.classList.add("is-revealed");
      });
      return;
    }

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function easeOutBack(t) {
      // passa da posição final e volta (overshoot)
      var c1 = 3.4;
      var c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    }

    function clamp(n, min, max) {
      return Math.min(max, Math.max(min, n));
    }

    function progressFor(el) {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // Começa mais tarde: só quando o card já entrou bem na tela
      const start = vh * 0.78;
      const end = vh * 0.38;
      return clamp((start - rect.top) / (start - end), 0, 1);
    }

    function resetBounce(el) {
      el.classList.remove("is-revealed");
      el.style.opacity = "0";
      el.style.animation = "none";
      if (el.getAttribute("data-reveal") === "down") {
        el.style.transform = window.matchMedia("(max-width: 900px)").matches
          ? "translate3d(0, -36px, 0)"
          : "translate3d(-50%, -36px, 0)";
      } else {
        el.style.transform = window.matchMedia("(max-width: 900px)").matches
          ? "translate3d(0, 40px, 0)"
          : "translate3d(-50%, 40px, 0)";
      }
    }

    function playBounce(el) {
      el.style.opacity = "";
      el.style.transform = "";
      el.style.animation = "none";
      void el.offsetWidth;
      el.style.animation = "";
      el.classList.remove("is-revealed");
      void el.offsetWidth;
      el.classList.add("is-revealed");
    }

    if (bounceItems.length) {
      var bounceVisible = new WeakMap();

      const bounceObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var el = entry.target;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.45) {
            if (!bounceVisible.get(el)) {
              bounceVisible.set(el, true);
              playBounce(el);
            }
          } else if (!entry.isIntersecting) {
            bounceVisible.set(el, false);
            resetBounce(el);
          }
        });
      }, { threshold: [0, 0.45, 0.65], rootMargin: "0px 0px -18% 0px" });

      bounceItems.forEach(function (el) {
        resetBounce(el);
        bounceObs.observe(el);
      });
    }

    if (!slideItems.length) return;

    function update() {
      slideItems.forEach(function (el) {
        const dir = el.getAttribute("data-reveal");
        const delayMs = parseFloat(el.style.getPropertyValue("--reveal-delay")) || 0;
        const offset = Math.min(0.22, (delayMs / 1000) * 0.35);
        var raw = progressFor(el);
        var t = clamp((raw - offset) / Math.max(0.001, 1 - offset), 0, 1);
        var eased = easeOutBack(t);
        var opacity = easeOutCubic(t);

        el.style.opacity = String(opacity);
        // eased pode passar de 1 → ultrapassa a posição final e volta
        el.style.transform = dir === "left"
          ? "translate3d(" + ((1 - eased) * -104) + "px, 0, 0)"
          : "translate3d(" + ((1 - eased) * 104) + "px, 0, 0)";

        el.classList.toggle("is-revealed", t > 0.98);
      });
    }

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        update();
        ticking = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("resize", onScroll);
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });
    requestAnimationFrame(update);
    setTimeout(update, 50);
  }

  /* ---------- IMAGINE: esquerda acompanha altura da direita ---------- */
  function initImagineHeightMatch() {
    var left = document.querySelector(".imagine-photos");
    var right = document.querySelector(".imagine-card--story");
    if (!left || !right) return;

    function sync() {
      left.style.height = "";
      if (!window.matchMedia("(min-width: 900px)").matches) return;
      var height = right.getBoundingClientRect().height;
      if (height > 0) left.style.height = Math.round(height) + "px";
    }

    function bind(img) {
      if (!img.complete) img.addEventListener("load", sync);
    }

    left.querySelectorAll("img").forEach(bind);
    right.querySelectorAll("img").forEach(bind);
    window.addEventListener("resize", sync);
    requestAnimationFrame(sync);
    setTimeout(sync, 80);
    setTimeout(sync, 300);
  }
  function initCopy() {
    document.querySelectorAll("[data-copy]").forEach(function (el) {
      el.addEventListener("click", function () {
        const val = el.getAttribute("data-copy");
        navigator.clipboard && navigator.clipboard.writeText(val).then(function () {
          window.sdToast({ type: "success", title: "Copiado!", message: val });
        });
      });
    });
  }

  /* ---------- PROGRESS demo ---------- */
  function initProgressDemo() {
    document.querySelectorAll("[data-progress]").forEach(function (bar) {
      const target = parseInt(bar.getAttribute("data-progress"), 10) || 0;
      setTimeout(function () { bar.style.width = target + "%"; }, 300);
    });
  }

  /* ---------- INIT ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    renderIcons();
    initAccordions();
    initTabs();
    initDropdowns();
    initModals();
    initDrawers();
    initToastDemos();
    initScrollSpy();
    initReveal();
    initPainsScrollReveal();
    initImagineHeightMatch();
    initCopy();
    initProgressDemo();
  });
})();
