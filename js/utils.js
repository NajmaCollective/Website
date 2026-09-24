(() => {
  const button = document.querySelector('#menu-button');
  const menu = document.querySelector('#mobile-menu');
  if (button && menu) button.addEventListener('click', () => { menu.open = !menu.open; });

  const page = location.pathname.split('/').pop() || 'index.html';

  // Constellation artwork: Material shapes as stars joined by fine lines, each
  // carrying a filled symbol for its section. Decorative, so hidden from assistive tech.
  const motifs = {
    learning: { icons: ['school', 'translate', 'route'], shapes: ['cookie9', 'circle', 'clover4'] },
    conversation: { icons: ['forum', 'local_cafe', 'waving_hand'], shapes: ['sunny', 'cookie6', 'clover8'] },
    organisation: { icons: ['co_present', 'corporate_fare', 'handshake'], shapes: ['cookie12', 'circle', 'cookie4'] },
    online: { icons: ['videocam', 'record_voice_over', 'trending_up'], shapes: ['softburst', 'circle', 'cookie6'] },
    collective: { icons: ['diversity_3', 'public', 'volunteer_activism'], shapes: ['verysunny', 'cookie9', 'clover4'] }
  };
  const media = {
    'index.html': [
      { heading: 'What would you like to study?', motif: 'learning' },
      { heading: 'A collective run by its teachers', motif: 'collective' }
    ],
    'lessons.html': [
      { heading: 'What would you like to study?', motif: 'learning' },
      { heading: 'How lessons develop', motif: 'online' }
    ],
    'model.html': [
      { heading: 'What could your group work on?', motif: 'organisation' },
      { heading: 'Who we work with', motif: 'collective' }
    ],
    'join.html': [
      { heading: 'What happens in a session?', motif: 'conversation' },
      { heading: 'English in the Café', motif: 'learning' }
    ],
    'about.html': [
      { heading: 'Where Najma came from', motif: 'collective' },
      { heading: 'A collective shaped by its teachers', motif: 'online' }
    ]
  };

  // Node layout as [x %, y %, size as % of width]. The panel is 16:7.
  const nodes = [[24, 52, 30], [57, 32, 18], [82, 64, 16]];
  const sparks = [[43, 85, 5.5, 'star'], [91, 17, 4.5, 'star'], [8, 15, 3.5, 'star'], [68, 88, 2.8, 'dot']];
  const links = [[nodes[0], nodes[1]], [nodes[1], nodes[2]], [nodes[1], sparks[1]], [nodes[0], sparks[0]], [nodes[2], sparks[3]]];

  // Heading text without its decorative Material Symbols ligature (e.g. "co_present").
  const headingText = node => Array.from(node.childNodes)
    .filter(child => !(child.classList && child.classList.contains('material-symbols-outlined')))
    .map(child => child.textContent).join('').trim();

  const buildConstellation = (motif, flip) => {
    const x = value => (flip ? 100 - value : value);
    const figure = document.createElement('figure');
    figure.className = 'editorial-artwork';
    figure.setAttribute('aria-hidden', 'true');
    const lines = links.map(([a, b]) => `<line x1="${x(a[0])}" y1="${a[1] * .4375}" x2="${x(b[0])}" y2="${b[1] * .4375}"/>`).join('');
    figure.innerHTML = `<svg class="constellation-lines" viewBox="0 0 100 43.75" preserveAspectRatio="none" focusable="false">${lines}</svg>`;
    nodes.forEach(([nx, ny, size], index) => {
      const node = document.createElement('span');
      node.className = `constellation-node constellation-node--${index + 1} material-symbols-outlined`;
      node.style.cssText = `--x:${x(nx)};--y:${ny};--s:${size};--node-shape:var(--shape-${motif.shapes[index]})`;
      node.textContent = motif.icons[index];
      figure.append(node);
    });
    sparks.forEach(([sx, sy, size, kind]) => {
      const spark = document.createElement('span');
      spark.className = `constellation-spark constellation-spark--${kind}`;
      spark.style.cssText = `--x:${x(sx)};--y:${sy};--s:${size}`;
      figure.append(spark);
    });
    return figure;
  };

  const pageMedia = media[page] || [];
  const headings = Array.from(document.querySelectorAll('main h2'));
  pageMedia.forEach((item, index) => {
    const heading = headings.find(node => headingText(node) === item.heading);
    const section = heading?.closest('section');
    if (!section || section.querySelector(`[data-editorial-media="${index}"]`)) return;
    const figure = buildConstellation(motifs[item.motif], index % 2 === 1);
    figure.dataset.editorialMedia = String(index);
    // Sit in the right-hand column beside the heading, after its introduction when
    // there is one, so card grids below keep the full width.
    const intro = heading.nextElementSibling;
    (intro && intro.tagName === 'P' ? intro : heading).after(figure);
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
