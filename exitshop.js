/* ============================================================
   John King — Exitshop custom behaviour
   Repo: czdsgnr/exitshop-john-king  →  GitHub Pages
   Šablona = Bootstrap + Yamm mega menu.
   ============================================================ */
(function () {
  'use strict';

  var JK = (window.JK = window.JK || {});
  JK.version = '0.2.0';

  /* ---- konfigurace ---- */
  // USP položky do běžící lišty (uprav dle potřeby)
  JK.USP = [
    { i: '🚚', t: 'Bleskově: doprava už od 45 Kč' },
    { i: '✅', t: '99 % skladem — odesíláme ihned' },
    { i: '🎁', t: 'Doprava ZDARMA od 1 299 Kč (GLS)' },
    { i: '⭐', t: 'Ušetři s balíčky — výhodné sety' },
    { i: '⚡', t: 'Objednáš dnes, máš to zítra' }
  ];

  /* ---- helpers ---- */
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  /* ============================================================
     A) USP marquee – černá běžící lišta na začátku <header>
     ============================================================ */
  function buildUSP() {
    var header = document.querySelector('header');
    if (!header || document.querySelector('.jk-usp')) return;
    var items = JK.USP.map(function (u) {
      return '<span class="jk-usp__item"><span class="jk-usp__ico">' + u.i + '</span>' + u.t + '</span>';
    }).join('');
    var usp = el('div', 'jk-usp jk-injected', '<div class="jk-usp__track">' + items + items + '</div>');
    header.insertBefore(usp, header.firstChild);
  }

  /* ============================================================
     B) Košík – z ikony udělej pilulku „Košík · počet · cena"
     ============================================================ */
  function buildCartPill() {
    var cart = document.querySelector('a.shopping-basket');
    if (!cart || cart.querySelector('.jk-cart__label')) return;
    var count = (document.querySelector('.shopping-basket-items-count') || {}).textContent || '0';
    var handbag = cart.querySelector('.bi-handbag');

    var label = el('span', 'jk-cart__label jk-injected', 'Košík');
    if (handbag && handbag.nextSibling) cart.insertBefore(label, handbag.nextSibling);
    else cart.appendChild(label);

    // celková cena (jen když je v košíku něco)
    var totalRaw = (document.querySelector('.shopping-basket-total') || {}).textContent || '';
    var total = (totalRaw.match(/[\d\s.,]+Kč/) || [''])[0].trim();
    if (count.trim() !== '0' && total) {
      cart.appendChild(el('span', 'jk-cart__total jk-injected', total));
    }
  }

  /* ============================================================
     C) Pilulka „Všechny kategorie" na začátek lišty kategorií
     ============================================================ */
  function buildAllCats() {
    var ul = document.querySelector('#top-menu ul.navbar-nav');
    if (!ul || document.querySelector('.jk-allcats')) return;
    var logo = document.querySelector('a#logo');
    var root = logo ? logo.getAttribute('href') : '#';
    var li = el('li', 'jk-allcats jk-injected nav-item',
      '<a href="' + root + '" class="jk-allcats__btn">' +
      '<span class="jk-allcats__grid"><i></i><i></i><i></i><i></i></span>' +
      'Všechny kategorie<span class="jk-allcats__chev">▾</span></a>');
    ul.insertBefore(li, ul.firstChild);
  }

  /* ============================================================
     D) Sticky – po scrollu přidej .jk-sticky na <html>
        (kondenzovaná verze se dolaďuje v CSS – další iterace)
     ============================================================ */
  function initSticky() {
    var THRESHOLD = 120;
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        document.documentElement.classList.toggle('jk-sticky', window.pageYOffset > THRESHOLD);
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  ready(function () {
    document.documentElement.classList.add('jk-ready');
    try { buildUSP(); } catch (e) { console.warn('[JK] USP', e); }
    try { buildCartPill(); } catch (e) { console.warn('[JK] cart', e); }
    try { buildAllCats(); } catch (e) { console.warn('[JK] allcats', e); }
    initSticky();
    console.log('[JK] exitshop.js loaded v' + JK.version);
  });
})();
