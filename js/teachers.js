(() => {
  const grid = document.querySelector('#teacher-grid');
  const status = document.querySelector('#filter-status');
  if (!grid || !window.NAJMA_TEACHERS) return;

  const params = new URLSearchParams(location.search);
  let area = params.get('area') || 'all';

  const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  })[character]);

  const initials = name => name.split(/\s+/).filter(Boolean).map(part => part[0]).slice(0, 2).join('').toUpperCase();
  const list = items => `<ul class="profile-list">${items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
  const chips = items => `<div class="profile-chips" aria-label="Teaching highlights">${items.map(item => `<span>${escapeHtml(item)}</span>`).join('')}</div>`;

  const portrait = teacher => teacher.photo
    ? `<div class="portrait"><img src="${escapeHtml(teacher.photo)}" alt="Portrait of ${escapeHtml(teacher.name)}" loading="lazy" referrerpolicy="no-referrer" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><span class="portrait-fallback" hidden aria-hidden="true">${escapeHtml(initials(teacher.name))}</span></div>`
    : `<div class="portrait portrait-placeholder" role="img" aria-label="Profile photograph unavailable"><span class="portrait-fallback" aria-hidden="true">${escapeHtml(initials(teacher.name))}</span></div>`;

  const render = () => {
    const teachers = window.NAJMA_TEACHERS.filter(teacher => area === 'all' || teacher.areas.includes(area));

    grid.innerHTML = teachers.map(teacher => `
      <article class="teacher-card" id="${escapeHtml(teacher.id)}">
        ${portrait(teacher)}
        <div class="teacher-card-body">
          <p class="teacher-location"><span class="material-symbols-outlined" aria-hidden="true">location_on</span>${escapeHtml(teacher.location)}</p>
          <h3>${escapeHtml(teacher.name)}</h3>
          <p class="teacher-headline">${escapeHtml(teacher.headline)}</p>
          ${chips(teacher.highlights)}
          <p>${escapeHtml(teacher.about)}</p>
          <h4>I can help you with</h4>
          ${list(teacher.help)}
          <div class="profile-details" id="${escapeHtml(teacher.id)}-details" hidden>
            <h4>Qualifications</h4>
            ${list(teacher.qualifications)}
            <h4>Teaching experience</h4>
            <p>${escapeHtml(teacher.experience)}</p>
            <h4>What lessons with me are like</h4>
            <p>${escapeHtml(teacher.teaching)}</p>
            <h4>Languages</h4>
            <p>${escapeHtml(teacher.languages)}</p>
            <h4>Services I offer</h4>
            ${list(teacher.services)}
          </div>
          <div class="actions teacher-actions">
            <md-outlined-button class="profile-toggle" data-target="${escapeHtml(teacher.id)}-details" aria-controls="${escapeHtml(teacher.id)}-details" aria-expanded="false">
              <span slot="icon" class="material-symbols-outlined" aria-hidden="true">expand_more</span>
              <span class="toggle-label">View full profile</span>
            </md-outlined-button>
            <md-filled-button href="${escapeHtml(teacher.booking)}" target="_blank" rel="noopener noreferrer">
              <span slot="icon" class="material-symbols-outlined" aria-hidden="true">calendar_month</span>
              Book with ${escapeHtml(teacher.name)}
            </md-filled-button>
          </div>
        </div>
      </article>`).join('');

    status.textContent = `${teachers.length} ${teachers.length === 1 ? 'teacher' : 'teachers'} shown.`;
    document.querySelectorAll('[data-area]').forEach(chip => { chip.selected = chip.dataset.area === area; });

    document.querySelectorAll('.profile-toggle').forEach(button => button.addEventListener('click', () => {
      const details = document.getElementById(button.dataset.target);
      if (!details) return;
      const expanded = button.getAttribute('aria-expanded') === 'true';
      details.hidden = expanded;
      button.setAttribute('aria-expanded', String(!expanded));
      const icon = button.querySelector('.material-symbols-outlined');
      if (icon) icon.textContent = expanded ? 'expand_more' : 'expand_less';
      const label = button.querySelector('.toggle-label');
      if (label) label.textContent = expanded ? 'View full profile' : 'Hide full profile';
    }));
  };

  document.querySelectorAll('[data-area]').forEach(chip => chip.addEventListener('click', () => {
    area = chip.dataset.area;
    const url = new URL(location);
    if (area === 'all') url.searchParams.delete('area');
    else url.searchParams.set('area', area);
    history.replaceState({}, '', url);
    render();
  }));

  render();
})();
