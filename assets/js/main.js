/* Formative — site interactions
   Small, dependency-free, progressive-enhancement JS. */
(function () {
  "use strict";

  /* ---- Mobile nav toggle ---- */
  var nav = document.querySelector(".nav");
  var toggle = document.querySelector(".nav__toggle");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll(".nav__link").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ---- Sticky header shadow ---- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- FAQ accordion ---- */
  document.querySelectorAll(".faq__item").forEach(function (item) {
    var q = item.querySelector(".faq__q");
    if (!q) return;
    q.addEventListener("click", function () {
      var open = item.classList.contains("is-open");
      // close siblings within the same list for a clean single-open feel
      var parent = item.parentElement;
      if (parent) {
        parent.querySelectorAll(".faq__item.is-open").forEach(function (sib) {
          if (sib !== item) {
            sib.classList.remove("is-open");
            var sq = sib.querySelector(".faq__q");
            if (sq) sq.setAttribute("aria-expanded", "false");
          }
        });
      }
      item.classList.toggle("is-open", !open);
      q.setAttribute("aria-expanded", !open ? "true" : "false");
    });
  });

  /* ---- Reveal on scroll ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---- Parallax (performant, rAF-throttled, motion-safe) ----
     Elements with [data-parallax="0.2"] drift as the page scrolls.
     Disabled for reduced-motion users and on coarse/touch pointers. */
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;
  var parallaxEls = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));

  if (!prefersReduced && finePointer && parallaxEls.length) {
    var ticking = false;
    var update = function () {
      var vh = window.innerHeight;
      parallaxEls.forEach(function (el) {
        var speed = parseFloat(el.getAttribute("data-parallax")) || 0.15;
        var rect = el.getBoundingClientRect();
        // distance of element center from viewport center, normalized
        var center = rect.top + rect.height / 2;
        var offset = (center - vh / 2) * speed * -1;
        el.style.transform = "translate3d(0," + offset.toFixed(1) + "px,0)";
      });
      ticking = false;
    };
    var requestTick = function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    };
    window.addEventListener("scroll", requestTick, { passive: true });
    window.addEventListener("resize", requestTick, { passive: true });
    update();
  }

  /* ---- Animated match-score bars when scrolled into view ---- */
  var scoreCards = document.querySelectorAll("[data-animate-scores]");
  if ("IntersectionObserver" in window && scoreCards.length) {
    var sObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll(".scorebar__fill").forEach(function (bar) {
            var to = bar.getAttribute("data-to") || "0%";
            if (prefersReduced) { bar.style.width = to; return; }
            bar.style.width = "0%";
            requestAnimationFrame(function () {
              bar.style.transition = "width 1.1s cubic-bezier(0.22,1,0.36,1)";
              requestAnimationFrame(function () { bar.style.width = to; });
            });
          });
          sObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    scoreCards.forEach(function (c) { sObs.observe(c); });
  }

  /* ---- Footer year ---- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
