(() => {
  const grid = document.querySelector('#teacher-grid');
  const status = document.querySelector('#filter-status');
  if (!grid || !window.NAJMA_TEACHERS) return;
  const params = new URLSearchParams(location.search);
  const chips = [...document.querySelectorAll('[data-area]')];
  const validAreas = chips.map(chip => chip.dataset.area);
  let area = validAreas.includes(params.get('area')) ? params.get('area') : 'all';
  const introOnly = params.get('service') === 'intro';
  // Draft entries remain in the data file until approved profiles are supplied.
  const approved = window.NAJMA_TEACHERS.filter(t => t.published === true);
  const escape = value => String(value || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const render = () => {
    const teachers = approved.filter(t => (area === 'all' || t.areas.includes(area)) && (!introOnly || t.intro === true));
    grid.innerHTML = teachers.length ? teachers.map(t => `<article class="teacher-card" id="${escape(t.id)}"><div class="portrait" aria-hidden="true"><span class="material-symbols-outlined">person</span></div><h3>${escape(t.name)}</h3><p>${escape(t.introduction)}</p><h4>I can help you with</h4><p>${escape(t.help)}</p><h4>Lesson options</h4><p>${escape(t.options)}</p><h4>How I teach</h4><p>${escape(t.teaching)}</p><md-filled-button href="mailto:info@najmacollective.org?subject=${encodeURIComponent(t.name + ' availability')}">Ask about availability</md-filled-button></article>`).join('') : `<div class="empty-state"><span class="material-symbols-outlined" aria-hidden="true">diversity_3</span><h3>${approved.length ? 'Let us help you find a teacher' : 'Meet the collective soon'}</h3><p>${approved.length ? 'Contact us about the teaching you are looking for and we can discuss suitable options.' : 'We are preparing our teachers’ profiles. In the meantime, tell us what you would like to work on and ask about available lessons.'}</p>${introOnly ? '<p>You are looking for a free 20-minute introductory appointment. Ask us which teachers offer one.</p>' : ''}<md-filled-button href="mailto:info@najmacollective.org?subject=${encodeURIComponent(introOnly ? 'Free introductory appointment' : 'English lessons: ' + area)}">${introOnly ? 'Ask about an introduction' : 'Ask about lessons'}<span slot="icon" class="material-symbols-outlined" aria-hidden="true">arrow_outward</span></md-filled-button></div>`;
    status.textContent = teachers.length ? `${teachers.length} teachers shown.` : 'Contact us for teacher availability.';
    chips.forEach(chip => { chip.selected = chip.dataset.area === area; });
  };
  chips.forEach(chip => chip.addEventListener('click', () => {
    area = chip.dataset.area;
    const url = new URL(location);
    area === 'all' ? url.searchParams.delete('area') : url.searchParams.set('area',area);
    history.replaceState({},'',url);
    render();
  }));
  render();
})();
