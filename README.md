# Lauren Leven — Portfolio

A lightweight, responsive, Zune-inspired portfolio. No build step or dependencies required (web fonts load from Google Fonts).

## Preview
Open `index.html` in a browser or serve the folder with any static web server.

## Edit content
All companies and projects are in **content.js**. Add a company to `companies`, or add as many entries as you want to a company's `projects` array. Set `image: "images/filename.webp"` after uploading the file to an `images` folder. An empty image string displays a decorative placeholder. Update the contact email at the top of `content.js`.

## Change the design
Edit CSS variables at the top of **styles.css** to change colors. Layout and motion styles are in the same file. HTML sections are in **index.html**. Rendering and accessible company collection interactions are in **script.js**.

## Cloudflare Pages
1. In Cloudflare, go to **Workers & Pages → Create → Pages → Connect to Git**.
2. Select `lunarlauren/Portfolio` and branch `main`.
3. Framework preset: **None**. Build command: **leave blank**. Output directory: **/** (repository root).
4. Deploy, verify the preview URL, then connect your custom domain when ready.

This repository has **not** been deployed by ChatGPT. Replace sample projects and the placeholder email before sharing publicly.

## Accessibility notes
Semantic landmarks, a skip link, visible keyboard focus, native button controls, descriptive labels, responsive touch targets, and `prefers-reduced-motion` are included. Audit with keyboard navigation, screen readers, Lighthouse and axe before launch.