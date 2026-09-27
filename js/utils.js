(() => {
  const button = document.querySelector('#menu-button');
  const menu = document.querySelector('#mobile-menu');
  if (button && menu) button.addEventListener('click', () => { menu.open = !menu.open; });

  // Heading text without its decorative Material Symbols ligature (e.g. "co_present").
  const headingText = node => Array.from(node.childNodes)
    .filter(child => !(child.classList && child.classList.contains('material-symbols-outlined')))
    .map(child => child.textContent).join('').trim();

  // Teachers without an approved photograph are shown with a Material monogram avatar.
  const teacherPreviews = [
    { id: 'mondher-yousfi', name: 'Mondher Yousfi', location: 'Sfax, Tunisia', headline: 'English teacher specialising in General English and language test preparation', photo: 'assets/teachers/mondher-yousfi.jpg', alt: 'Portrait of Mondher Yousfi' },
    { id: 'amina', name: 'Amina', location: 'Algeria', headline: 'Trained English teacher specialising in academic English, General English and conversation', photo: null },
    { id: 'hannah-copeland', name: 'Hannah Copeland', location: 'Bordeaux, France', headline: 'Teacher and educator specialising in academic, professional and functional English', photo: 'assets/teachers/hannah-copeland.jpg', alt: 'Portrait of Hannah Copeland' }
  ];

  const previewLocations = [
    { heading: 'Experienced English teachers', prefixes: ['[Confirmed teacher profiles'] },
    { heading: 'Meet the teachers', prefixes: ['[Teacher card'] },
    { heading: 'Who teaches organisational programmes?', prefixes: ['[Organisation teacher card'] },
    { heading: 'Our teachers', prefixes: ['[Teacher card'] }
  ];

  const monogram = teacher => {
    const letter = document.createElement('span');
    letter.setAttribute('aria-hidden', 'true');
    letter.textContent = teacher.name.trim().charAt(0).toUpperCase();
    return letter;
  };

  const allProfileHeadings = Array.from(document.querySelectorAll('main h2, main h3'));
  previewLocations.forEach(config => {
    const heading = allProfileHeadings.find(node => headingText(node) === config.heading);
    const section = heading?.closest('section');
    if (!section || section.querySelector('[data-teacher-previews]')) return;
    const placeholders = Array.from(section.querySelectorAll('p')).filter(paragraph => config.prefixes.some(prefix => paragraph.textContent.trim().startsWith(prefix)));
    if (!placeholders.length) return;
    const grid = document.createElement('div');
    grid.className = 'teacher-preview-grid';
    grid.dataset.teacherPreviews = '';
    const headingLevel = heading.tagName === 'H3' ? 'h4' : 'h3';
    teacherPreviews.forEach(teacher => {
      const article = document.createElement('article');
      article.className = 'teacher-preview-card';
      const avatar = document.createElement('div');
      avatar.className = 'teacher-avatar';
      if (teacher.photo) {
        const image = document.createElement('img');
        image.src = teacher.photo;
        image.alt = teacher.alt;
        image.width = 152;
        image.height = 152;
        image.loading = 'lazy';
        image.decoding = 'async';
        image.addEventListener('error', () => { image.replaceWith(monogram(teacher)); }, { once: true });
        avatar.append(image);
      } else {
        avatar.append(monogram(teacher));
      }
      const body = document.createElement('div');
      body.className = 'teacher-preview-body';
      body.innerHTML = `<p class="teacher-preview-location"><span class="material-symbols-outlined" aria-hidden="true">location_on</span>${teacher.location}</p><${headingLevel}>${teacher.name}</${headingLevel}><p>${teacher.headline}</p><a href="teachers.html#${teacher.id}">View ${teacher.name}'s profile</a>`;
      article.append(avatar, body);
      grid.append(article);
    });
    placeholders[0].replaceWith(grid);
    placeholders.slice(1).forEach(paragraph => paragraph.remove());
  });
})();
