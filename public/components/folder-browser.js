const button = document.getElementById('theme');
function syncTheme() {
  const dark = document.documentElement.dataset.theme === 'dark';
  button.setAttribute('aria-label', dark ? 'Use light theme' : 'Use dark theme');
  document.querySelector('meta[name="theme-color"]').content = dark ? '#151515' : '#f5f3ef';
}
button.hidden = false;
syncTheme();
button.addEventListener('click', () => {
  const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem('portfolio-theme', theme); } catch {}
  syncTheme();
});
