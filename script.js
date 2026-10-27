/* Portfolio rendering and collection interactions.
 * Content is maintained separately in content.js.
 */
(() => {
  "use strict";

  const data = window.PORTFOLIO;
  const companyGrid = document.querySelector("#company-grid");
  const playGrid = document.querySelector("#play-grid");
  const collection = document.querySelector("#collection");

  if (!data || !companyGrid || !playGrid || !collection) {
    console.error("Portfolio: required content or containers are missing.");
    return;
  }

  const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"
  })[char]);

  const imageMarkup = (project) => project.image
    ? `<img loading="lazy" src="${escapeHTML(project.image)}" alt="${escapeHTML(project.title)} project preview">`
    : '<span class="placeholder-mark" aria-hidden="true">✳</span>';

  const projectCard = (project) => `
    <article class="project-card">
      <div class="project-visual">${imageMarkup(project)}</div>
      <div class="project-meta"><span>${escapeHTML(project.type)}</span></div>
      <h4>${escapeHTML(project.title)}</h4>
      <p>${escapeHTML(project.summary)}</p>
    </article>`;

  const companyCard = (company, index) => `
    <button class="company-card ${company.featured ? "featured" : ""}"
      type="button" data-company="${escapeHTML(company.id)}"
      style="--accent:${escapeHTML(company.accent)};--i:${index}"
      aria-controls="collection" aria-expanded="false">
      <span class="card-top"><span>${escapeHTML(company.category)}</span><span aria-hidden="true">↗</span></span>
      <span class="company-name">${escapeHTML(company.name)}</span>
      <span class="company-description">${escapeHTML(company.description)}</span>
      <span class="card-bottom">${company.projects.length} PROJECT${company.projects.length === 1 ? "" : "S"} <span aria-hidden="true">→</span></span>
    </button>`;

  companyGrid.innerHTML = data.companies.map(companyCard).join("");
  playGrid.innerHTML = data.playground.map(projectCard).join("");

  // Index once: company selection does not need a linear search per click.
  const companiesById = new Map(data.companies.map((company) => [company.id, company]));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let activeButton = null;

  function closeCollection({ restoreFocus = false } = {}) {
    collection.hidden = true;
    collection.replaceChildren();
    collection.removeAttribute("data-active");
    collection.removeAttribute("aria-labelledby");
    if (activeButton) {
      activeButton.setAttribute("aria-expanded", "false");
      if (restoreFocus) activeButton.focus();
    }
    activeButton = null;
  }

  function toggleCompany(button) {
    const company = companiesById.get(button.dataset.company);
    if (!company) return;

    if (activeButton === button && !collection.hidden) {
      closeCollection({ restoreFocus: true });
      return;
    }

    closeCollection();
    activeButton = button;
    button.setAttribute("aria-expanded", "true");
    collection.innerHTML = `
      <div class="collection-head">
        <div>
          <p class="eyebrow">PROJECT COLLECTION</p>
          <h3 tabindex="-1" id="collection-title">${escapeHTML(company.name)}</h3>
          <p>${escapeHTML(company.description)}</p>
        </div>
        <button class="close-collection" type="button" aria-label="Close collection">×</button>
      </div>
      <div class="projects-grid">${company.projects.map(projectCard).join("")}</div>`;
    collection.dataset.active = company.id;
    collection.hidden = false;
    collection.setAttribute("aria-labelledby", "collection-title");
    collection.scrollIntoView({
      behavior: reducedMotion.matches ? "auto" : "smooth",
      block: "start"
    });
    // Move focus to the new content so keyboard and screen-reader users know it opened.
    collection.querySelector("#collection-title").focus({ preventScroll: true });
  }

  // Delegation avoids a listener for every card and survives future re-renders.
  companyGrid.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest("[data-company]");
    if (button && companyGrid.contains(button)) toggleCompany(button);
  });

  collection.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest(".close-collection")) {
      closeCollection({ restoreFocus: true });
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !collection.hidden) closeCollection({ restoreFocus: true });
  });

  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();

  if (data.email) {
    const email = `mailto:${encodeURIComponent(data.email)}`;
    for (const selector of ["#contact-link", "#email-link"]) {
      const link = document.querySelector(selector);
      if (link) link.href = email;
    }
  }
})();
