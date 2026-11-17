# ogün.se: portfolio site

Static site for Ogün Gündogdu, an AI engineer and game developer in Stockholm. Live at https://ogun.se. No build step, no dependencies.

## Files

- `index.html`: all page copy (hero, stats, "Games, made with AI end to end", the Sergeant Pace experiment, the path timeline, contact).
- `script.js`: the card data (`SHIPPED`, `GAMES` arrays), the hero shapes, the motion button, count-up and tilt effects.
- `style.css`: everything visual. `images/`: app icons and the itch.io logo. `.htaccess`: caching and blocked files.

## Preview and deploy

```bash
python -m http.server 8124        # in this folder, then open http://localhost:8124 ; stop it by port when done (Windows: Get-NetTCPConnection)
```

Hostinger pulls `main` from github.com/oguneg/ogun-se into `public_html` within seconds of a push. **Everything committed here is public**, so never commit notes, keys or drafts. `.htaccess` blocks `CLAUDE.md`, `AGENTS.md` and `.gitignore` from being served. Push only when asked, because a push is a release.

HTML, CSS and JS are served `no-cache`; images keep a 7-day cache, so rename an image file when you change it.

## Voice and facts

- Name: **Ogün Gündogdu** (no ğ). Logo text: `ogün.se`. Positioning: an AI engineer and game developer who builds games and apps with AI. The main story is his game pipeline: Claude Code drives the Unity editor through the Unity CLI (play mode, console, tests, game-view captures), headless play-test bots, Blender modelled by Python scripts, command-line builds and a reusable ads/consent/analytics kit. His Steam developer account is being set up; the PC games in development are named by genre only on the site, never by working title, until he announces them. **Sergeant Pace is an experiment, not a product or a flagship**: never describe it as commercial, production or as having real users. The site is also the shop window for his new sole proprietorship (enskild firma): the contact section ("Need something built?", nav pill "Work with me") invites client projects and collaborations. That is about winning work, not a job search, so still no employment tone ("open to roles", "hiring").
- The services on offer are only what he has actually shipped: AI features and agents, web apps and tools, games and prototypes. **Do not invent a business name, organisation number, prices, rates, guarantees or client names.** Once the firma is registered, add its name and org. number (Swedish marketing rules expect the trader to be identifiable).
- Contact: `hello@ogun.se`, written as **plain text**. **Never use `mailto:` links** (the owner's rule: nobody uses them), anywhere on the site, including the Bottle Smash pages. Never publish a phone number.
- Facts come from his CV and his repos only: 8 years of Unity and C# (since Jan 2018), 10M+ players reached, 100+ prototypes, 3 iOS US top-chart launches, 5 live web apps, Tap on Time 10M+ players, Phoca co-founder (2021 to 2023), Lessmore 2024 to 2025, Sergeant Pace 194 tests. **Do not invent numbers or tools.** The Lessmore block is deliberately general until he supplies specifics.
- Links: pace.ogun.se (the AI experiment), sl.ogun.se, oguneg.github.io/svenskfotboll, /verb-tranare, /walktoburn, the two App Store pages, ogun.itch.io, github.com/oguneg/sergeant-pace, linkedin.com/in/ogungundogdu.

## Quality bars (check before saying done)

- Every text element passes WCAG AA contrast. Compute it from the rendered styles; do not eyeball it.
- No horizontal scroll at 390 px. Heading text must never sit on a hero shape: the shapes treat the text column as an obstacle, and there is a test method for it (sample the canvas under `.hero-copy`).
- Motion: the hero is time-based (same speed at 60 and 120 Hz), resizing or zooming must not re-scatter the shapes, and exactly one animation loop may run. `<html data-motion>` is `on` or `off`; the default follows the system "reduce motion" setting and the pause/play button overrides it and remembers the choice. Anything that moves must respect it.
- Design checker: `impeccable detect --viewport 1280x800 <url>` (and `390x844`). The cream background and the scrolling tag strip are deliberate. A file-scoped ignore for low-contrast exists because the checker cannot see that the canvas never paints under text, so re-measure contrast yourself when editing.
- Bump `?v=` on `style.css` and `script.js` in `index.html` when you change them.
