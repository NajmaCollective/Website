(() => {
  const button = document.querySelector('#menu-button');
  const menu = document.querySelector('#mobile-menu');
  if (button && menu) button.addEventListener('click', () => { menu.open = !menu.open; });

  // Teachers without an approved photograph are shown with a Material monogram avatar.
  const teacherPreviews = [
    { id: 'mondher-yousfi', name: 'Mondher Yousfi', location: 'Sfax, Tunisia', headline: 'English teacher specialising in General English and language test preparation', photo: 'assets/teachers/mondher-yousfi.jpg', alt: 'Portrait of Mondher Yousfi' },
    { id: 'amina', name: 'Amina', location: 'Algeria', headline: 'Trained English teacher specialising in academic English, General English and conversation', photo: null },
    { id: 'hannah-copeland', name: 'Hannah Copeland', location: 'Bordeaux, France', headline: 'Teacher and educator specialising in academic, professional and functional English', photo: 'assets/teachers/hannah-copeland.jpg', alt: 'Portrait of Hannah Copeland' }
  ];

  const monogram = teacher => {
    const letter = document.createElement('span');
    letter.setAttribute('aria-hidden', 'true');
    letter.textContent = teacher.name.trim().charAt(0).toUpperCase();
    return letter;
  };

  // Each page marks where its previews go with an empty [data-teacher-previews-slot]
  // element, so headings can be reworded freely. Card names are h3 unless the slot
  // sits under an h3 and asks for h4 with data-heading-level.
  document.querySelectorAll('[data-teacher-previews-slot]').forEach(slot => {
    const grid = document.createElement('div');
    grid.className = 'teacher-preview-grid';
    grid.dataset.teacherPreviews = '';
    const headingLevel = slot.dataset.headingLevel === 'h4' ? 'h4' : 'h3';
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
      body.innerHTML = `<p class="teacher-preview-location"><span class="material-symbols-outlined" aria-hidden="true">location_on</span>${teacher.location}</p><${headingLevel}>${teacher.name}</${headingLevel}><p>${teacher.headline}</p><a href="teachers.html#${teacher.id}">View ${teacher.name}’s profile</a>`;
      article.append(avatar, body);
      grid.append(article);
    });
    slot.replaceWith(grid);
  });
})();
