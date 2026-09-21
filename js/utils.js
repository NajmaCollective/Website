(() => {
  const button = document.querySelector('#menu-button');
  const menu = document.querySelector('#mobile-menu');
  if (button && menu) button.addEventListener('click', () => { menu.open = !menu.open; });

  const page = location.pathname.split('/').pop() || 'index.html';
  const media = {
    'index.html': [
      { heading: 'Meet Najma at the Solidarity Café', src: 'assets/illustrations/cafe-conversation.svg', alt: 'Animated Material-style illustration of conversation and a small group.' },
      { heading: 'English for your organisation', src: 'assets/illustrations/organisations-team.svg', alt: 'Animated Material-style illustration of a group programme and presentation.' }
    ],
    'lessons.html': [
      { heading: 'What would you like to study?', src: 'assets/illustrations/lessons-learning.svg', alt: 'Animated Material-style illustration of a learning pathway.' },
      { heading: 'How lessons develop', src: 'assets/illustrations/home-learning.svg', alt: 'Animated Material-style illustration of online learning and conversation.' }
    ],
    'model.html': [
      { heading: 'What could your group work on?', src: 'assets/illustrations/organisations-team.svg', alt: 'Animated Material-style illustration of group learning for organisations.' },
      { heading: 'Who we work with', src: 'assets/illustrations/about-collective.svg', alt: 'Animated Material-style illustration of a connected teacher-led collective.' }
    ],
    'join.html': [
      { heading: 'What happens in a session?', src: 'assets/illustrations/cafe-conversation.svg', alt: 'Animated Material-style illustration of an online group conversation.' },
      { heading: 'English in the Café', src: 'assets/illustrations/lessons-learning.svg', alt: 'Animated Material-style illustration of learning through conversation.' }
    ],
    'about.html': [
      { heading: 'Where Najma came from', src: 'assets/illustrations/about-collective.svg', alt: 'Animated Material-style illustration of a connected education collective.' },
      { heading: 'A collective shaped by its teachers', src: 'assets/illustrations/home-learning.svg', alt: 'Animated Material-style illustration of teaching, conversation and learning.' }
    ]
  };

  const pageMedia = media[page] || [];
  const headings = Array.from(document.querySelectorAll('main h2'));
  pageMedia.forEach((item, index) => {
    const heading = headings.find(node => node.textContent.trim() === item.heading);
    const section = heading?.closest('section');
    if (!section || section.querySelector(`[data-editorial-media="${index}"]`)) return;
    const figure = document.createElement('figure');
    figure.className = 'editorial-artwork';
    figure.dataset.editorialMedia = String(index);
    const image = document.createElement('img');
    image.src = item.src;
    image.alt = item.alt;
    image.loading = 'lazy';
    image.decoding = 'async';
    const caption = document.createElement('figcaption');
    caption.className = 'visually-hidden';
    caption.textContent = 'Self-hosted vector artwork using Google Material icon source paths under the Apache 2.0 license.';
    figure.append(image, caption);
    section.append(figure);
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
    const heading = allProfileHeadings.find(node => node.textContent.trim() === config.heading);
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
