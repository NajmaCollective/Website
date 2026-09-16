(() => {
  const menu = document.querySelector('.mobile-nav');
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu?.open) {
      menu.open = false;
      menu.querySelector('summary').focus();
    }
  });
  document.addEventListener('click', event => {
    if (menu?.open && !menu.contains(event.target)) menu.open = false;
  });
  // The underlying native link is a progressive fallback for CDN failures.
  document.querySelectorAll('md-filled-button[href], md-filled-tonal-button[href], md-outlined-button[href], md-text-button[href]').forEach(button => {
    const href = button.getAttribute('href');
    if (customElements.get(button.localName)) return;
    button.setAttribute('role', 'link');
    button.tabIndex = 0;
    const activate = event => {
      if (customElements.get(button.localName)) return;
      if (event.type === 'click' || event.key === 'Enter') location.href = href;
    };
    button.addEventListener('click', activate);
    button.addEventListener('keydown', activate);
    customElements.whenDefined(button.localName).then(() => {
      button.removeAttribute('role');
      button.removeAttribute('tabindex');
    });
  });
  const carousel = document.querySelector('.lesson-carousel');
  if (!carousel) return;
  const controls = document.querySelector('.carousel-controls');
  const previous = controls.querySelector('[data-carousel-prev]');
  const next = controls.querySelector('[data-carousel-next]');
  const status = controls.querySelector('.carousel-status');
  const cards = [...carousel.children];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const step = () => cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : carousel.clientWidth;
  const update = () => {
    const end = carousel.scrollWidth - carousel.clientWidth;
    const index = Math.min(cards.length - 1, Math.round(carousel.scrollLeft / step()));
    previous.disabled = carousel.scrollLeft < 2;
    next.disabled = carousel.scrollLeft >= end - 2;
    status.textContent = `${index + 1} / ${cards.length}`;
  };
  const move = direction => carousel.scrollBy({left: direction * step(), behavior: reduced.matches ? 'instant' : 'smooth'});
  // Controls become available after the official Material component is ready.
  customElements.whenDefined('md-icon-button').then(() => { controls.hidden = false; update(); });
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  carousel.addEventListener('keydown', event => {
    if (event.target !== carousel) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1);
    }
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault(); carousel.scrollTo({left: event.key === 'Home' ? 0 : carousel.scrollWidth, behavior: reduced.matches ? 'instant' : 'smooth'});
    }
  });
  carousel.addEventListener('scroll', update, {passive: true});
  new ResizeObserver(update).observe(carousel);
  update();
})();
