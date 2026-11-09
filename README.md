# Misto Coffee

An original, responsive café website by **Cryvex**. A fictional business concept with a working menu and cart, built as a public web development portfolio project.

**[Open the live website](https://iseudueneue2-ux.github.io/misto-coffee/)** · [Cryvex portfolio](https://iseudueneue2-ux.github.io/freelance-bots-portfolio/)

## Features

- Six menu items with local photography, category filters and price sorting.
- Add, increase, decrease and remove items; exact integer UAH totals.
- Cart persists in localStorage; invalid saved entries are ignored, each item is capped at 20.
- Download a readable order list as a UTF-8 text file.
- Native modal dialog with Escape, keyboard focus containment and return to the opener.
- Mobile layouts, local variable Manrope with Ukrainian glyphs, reduced-motion support.
- No dependencies, build step, account, payment or external service required.

## Run locally

Requires Python 3, or any static web server:

```sh
python -m http.server 8766 --directory site
```

Open http://localhost:8766 in your browser. Publish `site/` through GitHub Pages.

## Scope

The café, its menu and prices are fictional. This is a complete static frontend, not a commissioned client project. The cart generates a local file; it does not send orders or charge payments. A production café would need a real menu, business details and a backend/order integration. No customer information is collected. Cart data stays in the visitor's browser.

Photos illustrate menu items, rather than documenting actual dishes. See [image credits](IMAGE-CREDITS.md). Manrope is distributed under the SIL Open Font License included in `site/assets/Manrope-OFL.txt`.
