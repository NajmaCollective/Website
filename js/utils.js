(() => {
  const button = document.querySelector('#menu-button');
  const menu = document.querySelector('#mobile-menu');
  if (!button || !menu) return;
  const sync = () => {
    button.setAttribute('aria-expanded', String(menu.open));
    button.setAttribute('aria-label', menu.open ? 'Close navigation menu' : 'Open navigation menu');
  };
  button.addEventListener('click', () => { menu.open = !menu.open; sync(); });
  menu.addEventListener('opened', sync);
  menu.addEventListener('closed', sync);
})();
