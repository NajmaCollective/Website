(() => {
  const grid = document.querySelector('#teacher-grid');
  const status = document.querySelector('#filter-status');
  if (!grid || !window.NAJMA_TEACHERS) return;
  const params = new URLSearchParams(location.search);
  let area = params.get('area') || 'all';
  const render = () => {
    const teachers = window.NAJMA_TEACHERS.filter(t => area === 'all' || t.areas.includes(area));
    grid.innerHTML = teachers.map(t => `<article class="teacher-card tonal" id="${t.id}"><div class="portrait" role="img" aria-label="Approved photograph">[Approved photograph]</div><h3>${t.name}</h3><p>${t.introduction}</p><h4>I can help you with</h4><p>${t.help}</p><h4>Lesson options</h4><p>${t.options}</p><h4>How I teach</h4><p>${t.teaching}</p><div class="actions"><md-text-button href="#${t.id}">View ${t.name.replace(/^\[|\]$/g,'')}’s profile</md-text-button><md-filled-button href="mailto:info@najmacollective.org?subject=${encodeURIComponent(t.name+' availability')}">Check availability</md-filled-button></div></article>`).join('');
    status.textContent = `${teachers.length} teachers shown.`;
    document.querySelectorAll('[data-area]').forEach(c => c.selected = c.dataset.area === area);
  };
  document.querySelectorAll('[data-area]').forEach(c => c.addEventListener('click', () => { area=c.dataset.area; const u=new URL(location); area==='all'?u.searchParams.delete('area'):u.searchParams.set('area',area); history.replaceState({},'',u); render(); }));
  render();
})();
