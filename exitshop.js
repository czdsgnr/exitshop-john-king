/* ============================================================
   John King — Exitshop custom behaviour
   Repo: czdsgnr/exitshop-john-king  →  GitHub Pages
   ============================================================ */
(function () {
  'use strict';

  var JK = (window.JK = window.JK || {});
  JK.version = '0.1.0';

  /* ---- helpers ---- */
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  // injektuje <style> blok (pro markup, který si tvoříme v JS)
  JK.css = function (id, css) {
    if (document.getElementById(id)) return;
    var s = document.createElement('style');
    s.id = id;
    s.textContent = css;
    document.head.appendChild(s);
  };

  /* ============================================================
     MODULY (stavíme po inspekci živého DOMu)
     ------------------------------------------------------------
     A) USP lišta  – marquee v #notification-bar (černá, růžové tečky)
     B) Sticky     – po scrollu .jk-sticky → kondenzovaný header (64px)
     C) Mega menu  – rozbalená kategorie
     ============================================================ */

  // --- B) Sticky header (kostra; třídu doladíme na reálný header) ---
  function initSticky() {
    var THRESHOLD = 80;
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        var s = window.pageYOffset > THRESHOLD;
        document.documentElement.classList.toggle('jk-sticky', s);
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  ready(function () {
    document.documentElement.classList.add('jk-ready');
    initSticky();
    console.log('[JK] exitshop.js loaded v' + JK.version);
  });
})();
