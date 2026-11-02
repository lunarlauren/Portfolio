# Quick guide for editing the portfolio

The live site is built from `public/`. Make website changes there; root-level files are not the published page.

## Find the right file

| Edit | File |
| --- | --- |
| Project names, descriptions, links, and image briefs | `public/content.js` |
| Page sections, hero text, and About content | `public/index.html` |
| Shared colors, fonts, focus rings, and spacing | `public/components/foundations.css` |
| Header and navigation | `public/components/navigation.css` |
| Work project cards | `public/components/work-cards.css` |
| About section | `public/components/about.css` |
| Case-study page layout | `public/components/case-study.css` |

For light and dark colors, look for the shared values near the top of `foundations.css`: `:root` is the default theme and `html[data-theme="dark"]` is the dark theme. Keep a change in the component file that owns the part you are editing. `public/styles.css` is a legacy file; don't add new styles there.

## Before publishing

1. Preview the change in both themes and at a phone and desktop width.
2. Use the keyboard to check that links and buttons show a visible focus ring. Keep touch targets at least 44px high.
3. If you add or change motion, check that it respects reduced-motion settings.
4. Keep project claims tied to documented work. An image brief is an illustration placeholder, not proof that a screen shipped or was tested.

Commits to GitHub `main` run the browser checks and feed the Cloudflare deployment. The production site uses the files in `public/`.
