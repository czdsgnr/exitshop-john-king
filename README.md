# exitshop-john-king

Custom CSS/JS pro e‑shop **John King** na platformě **Exitshop** (Váš e‑shop 2.0).

## Soubory
- `exitshop.css` – vizuální úpravy (scoped selektory, `!important` proti theme)
- `exitshop.js` – chování + injektovaná markup (USP lišta, sticky header, mega menu)
- `README.md` – tento návod

## Hosting
GitHub Pages, branch `main`:
- `https://czdsgnr.github.io/exitshop-john-king/exitshop.css`
- `https://czdsgnr.github.io/exitshop-john-king/exitshop.js`

## ⭐ PRODUKČNÍ nasazení (ostrý web – BEZ problikávání)

**Důležité:** vývojový loader (níže) injektuje CSS až *po* vykreslení → na chvíli
probleskne původní šablona (modré menu). Na ostrém webu se musí CSS načítat
**render-blocking v hlavičce** + cachovat. Pak se modré menu vůbec neukáže.

1. **Vzhled → Vaše CSS** (úplně nahoru, PRVNÍ řádek – `@import` musí být první):
   ```css
   @import url("https://czdsgnr.github.io/exitshop-john-king/exitshop.css?v=1");
   ```
2. **Vzhled → Skripty** (smazat dev-loader, dát jen tohle):
   ```html
   <script src="https://czdsgnr.github.io/exitshop-john-king/exitshop.js?v=1" defer></script>
   ```

CSS se aplikuje od prvního vykreslení → žádný flash původních barev/menu. Cache přes
`?v=1`. **Po každé úpravě zvednout `?v=1` → `?v=2` …** (vyčistí cache u návštěvníků).

> (Ideál, pokud admin umožní vlastní HTML v `<head>`: místo `@import` dát
> `<link rel="stylesheet" href="…/exitshop.css?v=1">` přímo do hlavičky – paralelní načtení.)

## Vývojový režim (jen při úpravách – ZPŮSOBUJE flash, na ostro nepoužívat)

`?t=Date.now()` = vždy čerstvá verze bez cache, ale injektuje se pozdě → problikává.
V adminu **Vzhled → Skripty → Na všech stránkách**:

```html
<script>
(function(){
  var t = '?t=' + Date.now();
  var base = 'https://czdsgnr.github.io/exitshop-john-king/';
  var l = document.createElement('link');
  l.rel = 'stylesheet'; l.href = base + 'exitshop.css' + t;
  document.head.appendChild(l);
  var s = document.createElement('script');
  s.src = base + 'exitshop.js' + t; s.defer = true;
  document.head.appendChild(s);
})();
</script>
```

## Deploy workflow
Edit → commit → push. GitHub Pages build trvá ~1–2 min, pak stačí refresh e‑shopu
(`Cmd+Shift+R` pro jistotu).

## Design (z návrhu)
Hlavička ve třech stavech:
1. **Plný header** (top of page, 3 řady) – USP lišta (černá, růžové tečky) → logo +
   fulltext + účet + oblíbené + košík (pill) → kategorie (pill „Všechny kategorie" + odkazy)
2. **Sticky verze** (po scrollu, 1 řada, kondenzovaná) – logo + nav + ikony + košík pill
3. **Mega menu** (rozbalená kategorie)

Paleta: černá `#0E0E0E`, růžová akcent `#EC1C8C`, krémové pozadí, kulaté pilulky.
