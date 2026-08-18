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
    const obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-revealed"); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { obs.observe(el); });
  }

  /* ---------- COPY tokens ---------- */
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
    initCopy();
    initProgressDemo();
  });
})();
