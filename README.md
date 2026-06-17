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

## Vložení do Exitshopu (vývojový režim – bez cache)

V adminu: **Vzhled → Skripty → Přidat** → název např. `John King – custom CSS/JS`,
umístění **Na všech stránkách**. Vlož tento načítací skript (přidává `?t=` timestamp,
takže každé načtení bere čerstvou verzi – řeší cache na mobilu i desktopu):

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

> Pole **Vzhled → Vaše CSS** se nepoužívá pro nové úpravy – vše je verzované tady.
> Staré inline CSS v „Vaše CSS" postupně přesuneme do `exitshop.css`.

Až bude hotovo, přepnout na statický `<link>`/`<script>` s pevným `?v=` (rychlejší
pro návštěvníky, využije cache).

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
