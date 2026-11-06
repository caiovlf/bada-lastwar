# BaDa — Alliance Command

A local, responsive BaDa website with a home page, alliance rules, and the leadership charter.

Open `index.html` in your browser. No installation, account, internet connection, or build step is required for local use. All fonts, styles, content, and scripts are included in the project.

The published site uses GitHub Pages at https://bada-lastwar.com/. The rules and leadership are available at `/rules/` and `/leadership/`.

## Pages

- `index.html`: home, available in English, Portuguese, Spanish, Korean, Vietnamese, and German.
- `rules/index.html`: fourteen alliance rules and the disciplinary guidelines in the same six languages. The original text and translations were extracted without changes from `BADA RULES_V1.html`.
- `leadership/index.html`: Leadership Charter v1.0 in the same six languages, including responsibilities, authority, team assignments, and guidance. All ten role cards start expanded and can be collapsed individually or together.

All three pages share a language selector: English, Portuguese, Spanish, Korean, Vietnamese, and German. A new browser session starts in English; an explicit choice is kept in session storage while navigating. If storage is unavailable, English is the default. The leadership overview refers to leaders collectively; specific R5 approval responsibilities remain in the charter.

## Features

- Complete original English charter content, with an overview and leadership roster.
- Ten expandable role descriptions, including main owners, support, responsibilities, and authority.
- Search by role, leader, or responsibility; category filters; expand/collapse all.
- Click a leader to find their roles, or a roster assignment to open its description.
- Decision guidelines, collaboration principles, weekly check-in, and leadership culture.
- Responsive layouts, keyboard navigation, reduced-motion support, and a print layout that expands all details.
- Shared visual identity and navigation between all three pages.
- Search across the rules in the selected language, with rule anchors preserved (`#regra-1`, etc.).

## Files

- `index.html`, `rules/index.html`, `leadership/index.html`: page structures.
- `styles.css`, `hub.css`: shared layout, responsive styles, and print rules.
- `home.js`: translations and language selection for the home page.
- `rules-data.js`: original rules and translations.
- `rules.js`: rules rendering, language selection, search, and printing.
- `charter.js`: original English content and assignments.
- `app.js`: content rendering, search, navigation, and printing.
- `language.js`: shared session language preference and English default.
- `leadership-i18n.js`: translated leadership content and interface labels.
- `brand.css`, `private-club.css`, `assets/brand/`: shared identity and The Private Club theme, with a fedora lion, diamond crest, aged gold, burgundy, pinstripes, and Art Deco details. The original crowned lion assets are retained.

For a local HTTP preview, run `node server.cjs` and open http://127.0.0.1:4173. Stop the server with Ctrl+C.
