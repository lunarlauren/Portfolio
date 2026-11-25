const cards = Array.from(document.querySelectorAll('[data-art]'));
const viewer = document.getElementById('viewer');
const image = document.getElementById('viewer-image');
const typeSelect = document.getElementById('inquiry-type');
let current = 0;
let opener;

function openDialog(dialog, trigger) {
  const previous = document.querySelector('dialog[open]');
  if (previous) previous.close();
  else opener = trigger;
  dialog.showModal();
}

function showArt(position) {
  current = (position + cards.length) % cards.length;
  const card = cards[current];
  image.src = card.querySelector('img').src;
  image.alt = card.dataset.alt;
  document.getElementById('viewer-title').textContent = card.querySelector('.caption').textContent;
  document.getElementById('viewer-description').textContent = card.dataset.description;
  document.getElementById('viewer-counter').textContent = (current + 1) + ' / ' + cards.length;
}

cards.forEach((card, index) => {
  card.addEventListener('click', () => {
    showArt(index);
    openDialog(viewer, card);
  });
});
document.getElementById('viewer-prev').addEventListener('click', () => showArt(current - 1));
document.getElementById('viewer-next').addEventListener('click', () => showArt(current + 1));
viewer.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    showArt(current + (event.key === 'ArrowLeft' ? -1 : 1));
  }
});

const viewerArt = viewer.querySelector('.viewer-art');
let start;
viewerArt.addEventListener('touchstart', event => {
  start = event.touches.length === 1 ? event.touches[0] : null;
}, { passive: true });
viewerArt.addEventListener('touchcancel', () => { start = null; });
viewerArt.addEventListener('touchend', event => {
  if (!start) return;
  const end = event.changedTouches[0];
  const dx = end.clientX - start.clientX;
  const dy = end.clientY - start.clientY;
  if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) showArt(current + (dx < 0 ? 1 : -1));
  start = null;
}, { passive: true });

document.getElementById('viewer-request').addEventListener('click', () => {
  const style = cards[current].dataset.art;
  typeSelect.value = typeSelect.querySelector('[data-style="' + style + '"]').value;
  openDialog(document.getElementById('contact'));
  typeSelect.focus();
});

document.querySelectorAll('[data-dialog]').forEach(button => {
  button.addEventListener('click', () => openDialog(document.getElementById(button.dataset.dialog), button));
});

document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    if (dialog === viewer && !viewer.open) image.removeAttribute('src');
    if (!document.querySelector('dialog[open]')) opener?.focus();
  });
});
