# ogün.se: portfolio site

Static site for Ogün Gündogdu, an AI engineer in Stockholm (formerly mobile games). Live at https://ogun.se. No build step, no dependencies.

## Files

- `index.html`: all page copy (hero, stats, Sergeant Pace flagship, the path timeline, contact).
- `script.js`: the card data (`SHIPPED`, `GAMES` arrays), the hero shapes, the motion button, the email link, count-up and tilt effects.
- `style.css`: everything visual. `images/`: app icons and the itch.io logo. `.htaccess`: caching and blocked files.

## Preview and deploy

```bash
python -m http.server 8124        # in this folder, then open http://localhost:8124 ; stop it by port when done (Windows: Get-NetTCPConnection)
```

Hostinger pulls `main` from github.com/oguneg/ogun-se into `public_html` within seconds of a push. **Everything committed here is public**, so never commit notes, keys or drafts. `.htaccess` blocks `CLAUDE.md`, `AGENTS.md` and `.gitignore` from being served. Push only when asked, because a push is a release.

HTML, CSS and JS are served `no-cache`; images keep a 7-day cache, so rename an image file when you change it.

## Voice and facts

- Name: **Ogün Gündogdu** (no ğ). Logo text: `ogün.se`. Positioning: an AI engineer who ships. No job-hunting tone ("open to roles", "hiring").
- Contact: `hello@ogun.se`, assembled in `script.js` so it is not in the page source. Never publish a phone number.
- Facts come from his CV and his repos only: 10M+ players reached, 100+ prototypes, 3 iOS US top-chart launches, 5 live web apps, Tap on Time 3.5M+ players, Phoca co-founder (2021 to 2023), Lessmore 2024 to 2025. **Do not invent numbers or tools.** The Lessmore block is deliberately general until he supplies specifics.
- Links: pace.ogun.se (flagship), sl.ogun.se, oguneg.github.io/svenskfotboll, /verb-tranare, /walktoburn, the two App Store pages, ogun.itch.io, github.com/oguneg/sergeant-pace, linkedin.com/in/ogungundogdu.

## Quality bars (check before saying done)

- Every text element passes WCAG AA contrast. Compute it from the rendered styles; do not eyeball it.
- No horizontal scroll at 390 px. Heading text must never sit on a hero shape: the shapes treat the text column as an obstacle, and there is a test method for it (sample the canvas under `.hero-copy`).
- Motion: the hero is time-based (same speed at 60 and 120 Hz), resizing or zooming must not re-scatter the shapes, and exactly one animation loop may run. `<html data-motion>` is `on` or `off`; the default follows the system "reduce motion" setting and the pause/play button overrides it and remembers the choice. Anything that moves must respect it.
- Design checker: `impeccable detect --viewport 1280x800 <url>` (and `390x844`). The cream background and the scrolling tag strip are deliberate. A file-scoped ignore for low-contrast exists because the checker cannot see that the canvas never paints under text, so re-measure contrast yourself when editing.
- Bump `?v=` on `style.css` and `script.js` in `index.html` when you change them.
