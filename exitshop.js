/* ============================================================
   John King — Exitshop custom behaviour
   Repo: czdsgnr/exitshop-john-king  →  GitHub Pages
   Šablona = Bootstrap + Yamm mega menu.
   ============================================================ */
(function () {
  'use strict';

  var JK = (window.JK = window.JK || {});
  JK.version = '0.3.0';

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
     D) Sticky lišta – logo (vlevo) + akce (vpravo) do #top-menu,
        viditelné jen ve stavu .jk-sticky (viz CSS sekce 6)
     ============================================================ */
  var SVG = {
    search: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>',
    user: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
    bag: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>'
  };
  function attr(sel, name, fallback) { var e = document.querySelector(sel); return e ? (e.getAttribute(name) || fallback) : fallback; }
  function buildStickyBar() {
    var nav = document.querySelector('#top-menu nav.navbar');
    var collapse = document.querySelector('#navbarSupportedContent');
    if (!nav || !collapse || document.querySelector('.jk-stick-logo')) return;

    // logo vlevo
    var logoSrc = attr('a#logo img', 'src', '');
    var L = el('a', 'jk-stick-logo jk-injected', '<img src="' + logoSrc + '" alt="John King">');
    L.href = attr('a#logo', 'href', '#');
    nav.insertBefore(L, collapse);

    // akce vpravo
    var count = (document.querySelector('.shopping-basket-items-count') || {}).textContent || '0';
    var A = el('div', 'jk-stick-actions jk-injected',
      '<button type="button" class="jk-stick-search" aria-label="Hledat">' + SVG.search + '</button>' +
      '<a class="jk-stick-acct" href="' + attr('a.customer-button', 'href', '#') + '" aria-label="Účet">' + SVG.user + '</a>' +
      '<a class="jk-stick-cart" href="' + attr('a.shopping-basket', 'href', '#') + '">' + SVG.bag +
      '<span class="jk-stick-cart__c">' + count + '</span></a>');
    nav.appendChild(A);

    // search → scroll nahoru + focus fulltextu
    A.querySelector('.jk-stick-search').addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(function () { var i = document.querySelector('#searchInput'); if (i) i.focus(); }, 450);
    });
    // sync počtu v košíku
    var src = document.querySelector('.shopping-basket-items-count');
    if (src && window.MutationObserver) {
      new MutationObserver(function () {
        var c = A.querySelector('.jk-stick-cart__c'); if (c) c.textContent = src.textContent;
      }).observe(src, { childList: true, characterData: true, subtree: true });
    }
  }

  /* ============================================================
     E) Sticky toggle – po scrollu přidej .jk-sticky na <html>
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
    try { buildStickyBar(); } catch (e) { console.warn('[JK] stickybar', e); }
    initSticky();
    console.log('[JK] exitshop.js loaded v' + JK.version);
  });
})();
