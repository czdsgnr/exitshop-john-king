/* ============================================================
   John King — Exitshop custom behaviour
   Repo: czdsgnr/exitshop-john-king  →  GitHub Pages
   Šablona = Bootstrap + Yamm mega menu.
   ============================================================ */
(function () {
  'use strict';

  var JK = (window.JK = window.JK || {});
  JK.version = '0.6.7';

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
    buildAllMenu(li);
  }

  // Posbírá VŠECHNY kategorie (i ty schované v overflow #navbar-mismatched-items)
  // i s podkategoriemi a postaví jeden panel .jk-allmenu pod pilulkou.
  function buildAllMenu(pill) {
    var container = document.querySelector('#top-menu .container');
    if (!container || document.querySelector('.jk-allmenu')) return;

    var seen = {}, cats = [];
    Array.prototype.forEach.call(document.querySelectorAll('#top-menu li.yamm-fw'), function (li) {
      var a = li.querySelector(':scope > a.nav-link') || li.querySelector(':scope > a');
      if (!a) return;
      var href = a.getAttribute('href');
      if (!href || seen[href]) return;
      seen[href] = 1;
      var subs = [];
      var dd = li.querySelector('.yamm-dropdown-menu');
      if (dd) {
        Array.prototype.forEach.call(dd.querySelectorAll('.cat-l-second'), function (b) {
          var sa = b.querySelector('.cat-l-second-name a');
          if (sa) subs.push({ name: sa.textContent.trim().replace(/\s+/g, ' '), href: sa.getAttribute('href') });
        });
      }
      cats.push({ name: a.textContent.trim().replace(/\s+/g, ' '), href: href, subs: subs });
    });
    if (!cats.length) return;
    JK.cats = cats; // pro mobilní full-screen menu

    var MAX = 5;
    var grid = cats.filter(function (c) { return c.subs.length > 0; });
    var chips = cats.filter(function (c) { return c.subs.length === 0; });

    var gridHTML = grid.map(function (c) {
      var sub = c.subs.slice(0, MAX).map(function (s) { return '<a href="' + s.href + '">' + s.name + '</a>'; }).join('<span class="sep">·</span>');
      var more = c.subs.length > MAX ? '<span class="sep">·</span><a class="jk-allmenu__more" href="' + c.href + '">+' + (c.subs.length - MAX) + ' dalších</a>' : '';
      return '<div class="jk-allmenu__cat"><a class="jk-allmenu__cat-title" href="' + c.href + '">' + c.name + '</a><div class="jk-allmenu__subs">' + sub + more + '</div></div>';
    }).join('');
    var chipsHTML = chips.length
      ? '<div class="jk-allmenu__chips"><span class="jk-allmenu__chips-label">Další kategorie</span>' +
        chips.map(function (c) { return '<a class="jk-chip" href="' + c.href + '">' + c.name + '</a>'; }).join('') + '</div>'
      : '';

    var panel = el('div', 'jk-allmenu jk-injected', '<div class="jk-allmenu__grid">' + gridHTML + '</div>' + chipsHTML);
    container.appendChild(panel);

    // na DESKTOPU odstraň nativní per-kategorie dropdowny úplně (data už máme v panelu) –
    // žádný prázdný box ani probliknutí na hover. Na mobilu je necháváme (accordion).
    if (window.innerWidth >= 992) {
      document.querySelectorAll('#top-menu ul.navbar-nav > li.yamm-fw .yamm-dropdown-menu, #navbar-mismatched-items .yamm-dropdown-menu')
        .forEach(function (d) { d.remove(); });
    }

    // řízený hover (otevři okamžitě, zavři s malou prodlevou – žádné blikání)
    var timer;
    function open() { clearTimeout(timer); panel.classList.add('jk-open'); }
    function close() { timer = setTimeout(function () { panel.classList.remove('jk-open'); }, 160); }
    pill.addEventListener('mouseenter', open);
    pill.addEventListener('mouseleave', close);
    panel.addEventListener('mouseenter', open);
    panel.addEventListener('mouseleave', close);
  }

  /* ============================================================
     C2) Login popup na hover ikony účtu
        vlevo přihlášení (POST /customer + CSRF z cookie),
        vpravo benefity + „Vytvořit účet" (/customer/register)
     ============================================================ */
  function cookie(n) { var m = document.cookie.match('(^|;)\\s*' + n + '\\s*=\\s*([^;]+)'); return m ? decodeURIComponent(m.pop()) : ''; }
  function csrfToken() { return cookie('csrf_cookie_name') || (document.querySelector('input[name=ci_csrf_token]') || {}).value || ''; }

  function buildLoginPopup() {
    var acc = document.querySelector('a.customer-button');
    var wrap = document.querySelector('.header-shop-customer-button');
    if (!acc || !wrap || document.querySelector('.jk-login-pop')) return;
    // přihlášený uživatel – login popup netřeba
    if (document.querySelector('a[href*="logout"], a[href*="odhlasit"], a[href*="odhlaseni"]')) return;

    var base = acc.getAttribute('href'); // .../customer
    var pop = el('div', 'jk-login-pop jk-injected',
      '<div class="jk-login-pop__col jk-login-pop__left">' +
        '<h3>Přihlášení</h3><p class="jk-login-pop__sub">Vítejte zpět! Přihlaste se ke svému účtu.</p>' +
        '<form action="' + base + '" method="post" accept-charset="utf-8">' +
          '<label for="jk-login-email">Váš email</label>' +
          '<input type="text" name="email" id="jk-login-email" autocomplete="username">' +
          '<label for="jk-login-pwd">Vaše heslo</label>' +
          '<input type="password" name="password" id="jk-login-pwd" autocomplete="current-password">' +
          '<input type="hidden" name="ci_csrf_token" value="">' +
          '<button type="submit" name="login" value="1" class="jk-login-pop__submit">Přihlásit se</button>' +
        '</form>' +
        '<a class="jk-login-pop__forgot" href="' + base + '">Zapomenuté heslo?</a>' +
      '</div>' +
      '<div class="jk-login-pop__col jk-login-pop__right">' +
        '<h3>Nemáte účet?</h3><p class="jk-login-pop__sub">S účtem John King získáte:</p>' +
        '<ul class="jk-login-pop__benefits">' +
          '<li>Rychlejší nákup bez vyplňování údajů</li><li>Přehled objednávek a faktur</li>' +
          '<li>Věrnostní slevy a akce dříve</li><li>Uložené oblíbené a adresy</li>' +
        '</ul>' +
        '<a class="jk-login-pop__reg" href="' + base + '/register">Vytvořit účet</a>' +
      '</div>');
    wrap.appendChild(pop);

    // CSRF token (CodeIgniter) – z cookie, nastav teď i těsně před odesláním
    var tokenInput = pop.querySelector('input[name=ci_csrf_token]');
    tokenInput.value = csrfToken();
    pop.querySelector('form').addEventListener('submit', function () { tokenInput.value = csrfToken(); });

    // řízený hover (žádné blikání) + potlač nativní hover košíku
    var hoverCart = document.querySelector('#hover-cart');
    var timer;
    function open() {
      clearTimeout(timer);
      pop.classList.add('jk-open');
      wrap.classList.add('jk-acc-hover');
      if (hoverCart) hoverCart.style.setProperty('display', 'none', 'important');
    }
    function close() {
      timer = setTimeout(function () {
        pop.classList.remove('jk-open');
        wrap.classList.remove('jk-acc-hover');
        if (hoverCart) hoverCart.style.removeProperty('display'); // vrátit nativní chování košíku
      }, 180);
    }
    acc.addEventListener('mouseenter', open);
    acc.addEventListener('mouseleave', close);
    pop.addEventListener('mouseenter', open);
    pop.addEventListener('mouseleave', close);
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
    var ticking = false, last = null;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        var s = window.pageYOffset > THRESHOLD;
        document.documentElement.classList.toggle('jk-sticky', s);
        if (s !== last) { last = s; if (JK.refitCategories) JK.refitCategories(); }  // jiná dostupná šířka → přepočítat
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ============================================================
     F) Kategorie inline – nativní „priority-nav" plugin schovává
        kategorie do (skrytého) overflow #navbar-mismatched-items i když
        je v liště místo (chybný výpočet) → vracíme je zpět do inline nav.
     ============================================================ */
  function unfoldCategories() {
    var dest = document.querySelector('#top-menu ul.navbar-nav');
    if (!dest) return;
    document.querySelectorAll('#navbar-mismatched-items li.yamm-fw').forEach(function (li) {
      dest.appendChild(li);
    });
  }
  // ukáže jen tolik kategorií, kolik se vejde CELÝCH (žádné ořezání/půlení), zbytek skryje.
  // na mobilu (<992) ukáže všechny (hamburger accordion).
  function fitCategories() {
    var ul = document.querySelector('#top-menu ul.navbar-nav');
    var collapse = document.querySelector('#navbarSupportedContent');
    if (!ul || !collapse) return;
    var cats = Array.prototype.slice.call(ul.querySelectorAll(':scope > li.yamm-fw'));
    cats.forEach(function (li) { li.style.display = ''; });           // reset
    if (window.innerWidth < 992) return;                              // mobil: všechny
    var pill = ul.querySelector('.jk-allcats');
    var avail = collapse.clientWidth - (pill ? pill.offsetWidth : 0) - 8;
    var used = 0, full = false;
    cats.forEach(function (li) {
      if (full) { li.style.display = 'none'; return; }
      used += li.offsetWidth;
      if (used > avail) { li.style.display = 'none'; full = true; }
    });
  }
  function initUnfold() {
    function refresh() { unfoldCategories(); fitCategories(); }
    JK.refitCategories = refresh;
    refresh();
    var mm = document.querySelector('#navbar-mismatched-items');
    if (mm && window.MutationObserver) {
      var t;
      new MutationObserver(function () { clearTimeout(t); t = setTimeout(refresh, 60); })
        .observe(mm, { childList: true, subtree: true });
    }
    window.addEventListener('load', function () { setTimeout(refresh, 200); });
    var rt;
    window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(fitCategories, 150); }, { passive: true });
  }

  /* ============================================================
     G) Homepage itembox karty – doplnit skladovost + zelené tlačítko „Do košíku"
        (itembox šablona je nemá; tlačítko skládáme z product ID + ceny –
        používá nativní třídy add-to-cart-js, ověřit že reálně přidá do košíku)
     ============================================================ */
  function buildItemboxExtras() {
    var added = 0;
    Array.prototype.forEach.call(document.querySelectorAll('.itembox-item'), function (item) {
      if (item.querySelector('.jk-ib-bottom')) return;
      var nameA = item.querySelector('a.product_name');
      var imgA = item.querySelector('a.fancybox_detail_pointer:not(.product_name)') || item.querySelector('a[href*="/p/"]');
      var href = (nameA && nameA.getAttribute('href')) || (imgA && imgA.getAttribute('href')) || '';
      var m = href.match(/\/p\/(\d+)-/);
      var pid = m ? m[1] : null;
      var cena = item.querySelector('.cena');
      var price = ((item.querySelector('.itembox-price') || {}).textContent || '').replace(/\s/g, '');
      var name = nameA ? nameA.textContent.trim() : '';
      var thumb = (item.querySelector('img') || {}).getAttribute('src') || '';
      if (!pid || !cena) return;

      var bottom = el('div', 'jk-ib-bottom jk-injected');
      bottom.appendChild(el('div', 'jk-ib-stock', '<span class="jk-ib-dot"></span>Skladem'));
      bottom.appendChild(cena); // cena na vlastní řádek
      var btn = el('div', 'jk-ib-cart product-add-to-shopping-basket add-to-cart-js add-to-cart-js-without-child btn btn-primary', 'Do košíku');
      btn.setAttribute('name', 'p' + pid);
      btn.setAttribute('data-product-id', pid + '-0');
      btn.setAttribute('data-oaaction', 'cart');
      btn.setAttribute('data-product-name', name);
      btn.setAttribute('data-product-minimal-order-amount', '1');
      btn.setAttribute('data-product-price', price);
      btn.setAttribute('data-product-thumbnail', thumb);
      bottom.appendChild(btn); // velké tlačítko přes celou šířku pod cenou
      item.appendChild(bottom);
      added++;
    });
    // nabindovat naše tlačítka na nativní košík (Exitshop váže při loadu, dynamicky vložená musíme přivázat ručně)
    if (added && typeof window.attach_add_to_cart_js === 'function') {
      try { window.attach_add_to_cart_js(); } catch (e) { console.warn('[JK] attachCart', e); }
    }
  }

  // Carousely/widgety se dorenderují postupně (ne všechny itembox karty jsou v DOM hned).
  // Sleduj DOM a doplň tlačítko každé kartě, jakmile se objeví – jinak část karet zůstane bez tlačítka.
  function initItembox() {
    function run() { try { buildItemboxExtras(); } catch (e) { console.warn('[JK] itembox', e); } }
    run();
    if (window.MutationObserver) {
      var t;
      new MutationObserver(function () { clearTimeout(t); t = setTimeout(run, 250); })
        .observe(document.body, { childList: true, subtree: true });
    }
    [600, 1500, 3000].forEach(function (ms) { setTimeout(run, ms); });
    window.addEventListener('load', function () { setTimeout(run, 300); });
  }

  /* ============================================================
     H) Mobilní full-screen menu (kategorie + rozbalovací podkategorie)
        z JK.cats; burger v hlavičce ho otevírá (nativní menu je na mobilu CSS skryté)
     ============================================================ */
  function buildMobileMenu() {
    if (document.querySelector('.jk-mobmenu')) return;
    var cats = JK.cats || [];
    if (!cats.length) return;

    var overlay = el('div', 'jk-mobmenu jk-injected');
    var head = el('div', 'jk-mobmenu__head', '<span class="jk-mobmenu__title">Kategorie</span>');
    var closeBtn = el('button', 'jk-mobmenu__close', '&times;');
    closeBtn.setAttribute('aria-label', 'Zavřít');
    head.appendChild(closeBtn);

    var list = el('div', 'jk-mobmenu__list');
    cats.forEach(function (c) {
      var item = el('div', 'jk-mobmenu__item');
      var a = el('a', 'jk-mobmenu__cat'); a.href = c.href; a.textContent = c.name;
      item.appendChild(a);
      if (c.subs && c.subs.length) {
        var tog = el('button', 'jk-mobmenu__toggle', '▼'); tog.setAttribute('aria-label', 'Rozbalit');
        var subs = el('div', 'jk-mobmenu__subs');
        c.subs.forEach(function (s) { var sa = el('a'); sa.href = s.href; sa.textContent = s.name; subs.appendChild(sa); });
        var allA = el('a', 'jk-mobmenu__all'); allA.href = c.href; allA.textContent = 'Zobrazit vše';
        subs.appendChild(allA);
        tog.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); item.classList.toggle('jk-open'); });
        item.appendChild(tog);
        item.appendChild(subs);
      }
      list.appendChild(item);
    });

    overlay.appendChild(head);
    overlay.appendChild(list);
    document.body.appendChild(overlay);

    function open() { document.documentElement.classList.add('jk-mobmenu-open'); }
    function close() { document.documentElement.classList.remove('jk-mobmenu-open'); }
    JK.openMobMenu = open; JK.closeMobMenu = close;
    closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

    // burger v hlavičce (capture, ať předběhnu nativní toggler) → otevři moje menu
    var burger = document.querySelector('.navbar-toggler-top .navbar-toggler');
    if (burger) {
      burger.addEventListener('click', function (e) {
        if (window.innerWidth >= 992) return;
        e.preventDefault(); e.stopPropagation();
        open();
      }, true);
    }
  }

  ready(function () {
    document.documentElement.classList.add('jk-ready');
    try { buildUSP(); } catch (e) { console.warn('[JK] USP', e); }
    try { buildCartPill(); } catch (e) { console.warn('[JK] cart', e); }
    try { buildAllCats(); } catch (e) { console.warn('[JK] allcats', e); }
    try { buildMobileMenu(); } catch (e) { console.warn('[JK] mobmenu', e); }
    try { buildLoginPopup(); } catch (e) { console.warn('[JK] loginpopup', e); }
    try { buildStickyBar(); } catch (e) { console.warn('[JK] stickybar', e); }
    try { initUnfold(); } catch (e) { console.warn('[JK] unfold', e); }
    try { initItembox(); } catch (e) { console.warn('[JK] itembox', e); }
    initSticky();
    console.log('[JK] exitshop.js loaded v' + JK.version);
  });
})();
