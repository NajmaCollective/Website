(() => {
  const button = document.querySelector('#menu-button');
  const menu = document.querySelector('#mobile-menu');
  if (button && menu) button.addEventListener('click', () => { menu.open = !menu.open; });

  const page = location.pathname.split('/').pop() || 'index.html';
  // Editorial illustrations (assets/illustrations, built by tools/illustrations). Each sits
  // beside the named heading; `beside: 'card'` places it above the split layout's card instead.
  const media = {
    'index.html': [
      { heading: 'Meet Najma at the Solidarity Café', art: 'cafe-chat', beside: 'card', alt: 'Two people talking over coffee at a café table.' },
      { heading: 'English for your organisation', art: 'org-team', alt: 'Three colleagues, one using a wheelchair, talking through a plan together.' }
    ],
    'lessons.html': [
      { heading: 'Check your English level', art: 'lessons-level', alt: 'A learner answering multiple-choice questions on a phone beside a rising level chart.' },
      { heading: 'How lessons connect over time', art: 'lessons-progress', alt: 'A learner climbing a staircase of books towards a flag marked with a star.' }
    ],
    'model.html': [
      { heading: 'English for international meetings', art: 'model-meeting', alt: 'Six people meeting on a video call while one of them speaks.' },
      { heading: 'Who we work with', art: 'model-community', alt: 'Four people from community and campaign groups gathered beneath bunting.' }
    ],
    'join.html': [
      { heading: 'What happens in a session?', art: 'join-circle', alt: 'Three people sitting around a low table with drinks; one speaks while the others listen.' },
      { heading: 'English in the Café', art: 'join-language', alt: 'Two people in conversation, their speech bubbles overlapping.' }
    ],
    'about.html': [
      { heading: 'Where Najma came from', art: 'about-roots', alt: 'An olive tree growing from an open book while two people read and look on.' },
      { heading: 'A collective shaped by its teachers', art: 'about-vote', alt: 'Four teachers raising their hands as a ballot drops into a box.' }
    ]
  };

  // Heading text without any Material Symbols ligature it may contain (e.g. "co_present").
  const headingText = node => Array.from(node.childNodes)
    .filter(child => !(child.classList && child.classList.contains('material-symbols-outlined')))
    .map(child => child.textContent).join('').trim();

  const pageMedia = media[page] || [];
  const headings = Array.from(document.querySelectorAll('main h2'));
  pageMedia.forEach((item, index) => {
    const heading = headings.find(node => headingText(node) === item.heading);
    const section = heading?.closest('section');
    if (!section || section.querySelector(`[data-editorial-media="${index}"]`)) return;
    const figure = document.createElement('figure');
    figure.className = 'editorial-artwork';
    figure.dataset.editorialMedia = String(index);
    // Animated artwork, with a still copy for anyone who prefers reduced motion.
    const picture = document.createElement('picture');
    const still = document.createElement('source');
    still.srcset = `assets/illustrations/${item.art}-still.svg`;
    still.media = '(prefers-reduced-motion: reduce)';
    const image = document.createElement('img');
    image.src = `assets/illustrations/${item.art}.svg`;
    image.alt = item.alt;
    image.width = 600;
    image.height = 500;
    image.loading = 'lazy';
    image.decoding = 'async';
    picture.append(still, image);
    figure.append(picture);
    const card = item.beside === 'card' ? section.lastElementChild : null;
    if (card && card !== heading.parentElement) section.insertBefore(figure, card);
    else heading.after(figure);
    section.classList.add('has-art');
  });

  const teacherPreviews = [
    { id: 'mondher-yousfi', name: 'Mondher Yousfi', location: 'Sfax, Tunisia', headline: 'English teacher specialising in General English and language test preparation', photo: 'assets/teachers/mondher-yousfi.jpg', alt: 'Portrait of Mondher Yousfi' },
    { id: 'amina', name: 'Amina', location: 'Algeria', headline: 'Trained English teacher specialising in academic English, General English and conversation', photo: 'assets/teachers/amina-placeholder.svg', alt: 'Illustrated profile placeholder for Amina; photograph pending' },
    { id: 'hannah-copeland', name: 'Hannah Copeland', location: 'Bordeaux, France', headline: 'Teacher and educator specialising in academic, professional and functional English', photo: 'assets/teachers/hannah-copeland.jpg', alt: 'Portrait of Hannah Copeland' }
  ];

  const previewLocations = [
    { heading: 'Experienced English teachers', prefixes: ['[Confirmed teacher profiles'] },
    { heading: 'Meet the teachers', prefixes: ['[Teacher card'] },
    { heading: 'Who teaches organisational programmes?', prefixes: ['[Organisation teacher card'] },
    { heading: 'Our teachers', prefixes: ['[Teacher card'] }
  ];

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
      const mediaWrap = document.createElement('div');
      mediaWrap.className = 'teacher-preview-media';
      const image = document.createElement('img');
      image.src = teacher.photo;
      image.alt = teacher.alt;
      image.loading = 'lazy';
      image.decoding = 'async';
      image.addEventListener('error', () => { image.src = 'assets/teachers/amina-placeholder.svg'; image.alt = `Illustrated profile placeholder for ${teacher.name}`; }, { once: true });
      mediaWrap.append(image);
      const body = document.createElement('div');
      body.className = 'teacher-preview-body';
      body.innerHTML = `<p class="teacher-preview-location">${teacher.location}</p><${headingLevel}>${teacher.name}</${headingLevel}><p>${teacher.headline}</p><a href="teachers.html#${teacher.id}">View ${teacher.name}'s profile</a>`;
      article.append(mediaWrap, body);
      grid.append(article);
    });
    placeholders[0].replaceWith(grid);
    placeholders.slice(1).forEach(paragraph => paragraph.remove());
  });
})();
