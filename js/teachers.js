(() => {
  const grid = document.querySelector('#teacher-grid');
  const status = document.querySelector('#filter-status');
  if (!grid || !window.NAJMA_TEACHERS) return;
  const params = new URLSearchParams(location.search);
  const validAreas = [...document.querySelectorAll('[data-area]')].map(c => c.dataset.area);
  let area = validAreas.includes(params.get('area')) ? params.get('area') : 'all';
  let service = ['short', 'intro'].includes(params.get('service')) ? params.get('service') : 'all';
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const render = () => {
    // Draft profile data stays unpublished until its owner confirms it.
    const confirmed = window.NAJMA_TEACHERS.filter(t => t.confirmed === true);
    const teachers = confirmed.filter(t => (area === 'all' || t.areas.includes(area)) && (service === 'all' || t.services?.includes(service)));
    grid.innerHTML = teachers.length ? teachers.map(t => `<article class="teacher-card" id="${escape(t.id)}"><h3>${escape(t.name)}</h3><p>${escape(t.introduction)}</p><h4>I can help you with</h4><p>${escape(t.help)}</p><h4>Lesson options</h4><p>${escape(t.options)}</p><h4>How I teach</h4><p>${escape(t.teaching)}</p><md-filled-button href="mailto:info@najmacollective.org?subject=${encodeURIComponent(t.name+' availability')}">Ask about availability</md-filled-button></article>`).join('') : `<article class="teacher-empty"><span class="material-symbols-outlined" aria-hidden="true">waving_hand</span><div><p class="eyebrow">LET’S FIND YOUR STARTING POINT</p><h3>${confirmed.length ? 'Tell us what you are looking for.' : 'Meet your future teacher.'}</h3><p>${confirmed.length ? 'There are currently no confirmed profiles for this combination. You can explore another teaching area or ask us about availability.' : 'Our first teacher profiles are being confirmed. In the meantime, tell us about your English and we can discuss current availability.'}</p><p>${service === 'intro' ? 'You are looking for a free 20-minute introductory appointment.' : service === 'short' ? 'You are looking for a 25-minute lesson at £10.' : 'Private lessons cost £20 for 55 minutes.'}</p><md-filled-button href="mailto:info@najmacollective.org?subject=${encodeURIComponent('Teacher enquiry: '+area+' / '+service)}">Ask about ${service === 'intro' ? 'an introduction' : service === 'short' ? 'a short lesson' : 'a teacher'}</md-filled-button></div></article>`;
    status.textContent = teachers.length ? `${teachers.length} teachers shown.` : 'Teacher availability by enquiry. No confirmed profiles match this selection.';
    document.querySelectorAll('[data-area]').forEach(c => c.selected = c.dataset.area === area);
    document.querySelectorAll('[data-service]').forEach(c => c.selected = c.dataset.service === service);
  };
  const select = (key, value) => {
    if (key === 'area') area = value; else service = value;
    const url = new URL(location); value === 'all' ? url.searchParams.delete(key) : url.searchParams.set(key, value);
    history.replaceState({}, '', url); render();
  };
  document.querySelectorAll('[data-area]').forEach(c => c.addEventListener('click', () => select('area', c.dataset.area)));
  document.querySelectorAll('[data-service]').forEach(c => c.addEventListener('click', () => select('service', c.dataset.service)));
  render();
})();
