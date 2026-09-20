(() => {
  const button = document.querySelector('#menu-button');
  const menu = document.querySelector('#mobile-menu');
  if (button && menu) button.addEventListener('click', () => { menu.open = !menu.open; });

  const page = location.pathname.split('/').pop() || 'index.html';
  const media = {
    'index.html': [
      {
        heading: 'Meet Najma at the Solidarity Café',
        src: 'https://images.pexels.com/photos/3753009/pexels-photo-3753009.jpeg?cs=srgb&fm=jpg',
        alt: 'Adults gathered around a laptop in an illustrative stock photograph.',
        position: 'center 42%'
      },
      {
        heading: 'English for your organisation',
        src: 'https://images.pexels.com/photos/7550396/pexels-photo-7550396.jpeg?cs=srgb&fm=jpg',
        alt: 'A diverse group collaborating around a laptop in an illustrative stock photograph.',
        position: 'center 48%'
      }
    ],
    'lessons.html': [
      {
        heading: 'What would you like to study?',
        src: 'https://images.pexels.com/photos/17558054/pexels-photo-17558054.jpeg?cs=srgb&fm=jpg',
        alt: 'Adults working together with a laptop in an illustrative stock photograph.',
        position: 'center 44%'
      },
      {
        heading: 'How lessons develop',
        src: 'https://images.pexels.com/photos/6340680/pexels-photo-6340680.jpeg?cs=srgb&fm=jpg',
        alt: 'Young adults discussing work around a laptop in an illustrative stock photograph.',
        position: 'center 45%'
      }
    ],
    'model.html': [
      {
        heading: 'What could your group work on?',
        src: 'https://images.pexels.com/photos/3183186/pexels-photo-3183186.jpeg?cs=srgb&fm=jpg',
        alt: 'Professionals collaborating around a table in an illustrative stock photograph.',
        position: 'center 45%'
      },
      {
        heading: 'Who we work with',
        src: 'https://images.pexels.com/photos/6340695/pexels-photo-6340695.jpeg?cs=srgb&fm=jpg',
        alt: 'A group discussing a project around a laptop in an illustrative stock photograph.',
        position: 'center 48%'
      }
    ],
    'join.html': [
      {
        heading: 'What happens in a session?',
        src: 'https://images.pexels.com/photos/18999192/pexels-photo-18999192.jpeg?cs=srgb&fm=jpg',
        alt: 'Adults listening and talking together in an illustrative stock photograph.',
        position: 'center 48%'
      },
      {
        heading: 'English in the Café',
        src: 'https://images.pexels.com/photos/3867189/pexels-photo-3867189.jpeg?cs=srgb&fm=jpg',
        alt: 'Adults sharing ideas beside a laptop in an illustrative stock photograph.',
        position: 'center 45%'
      }
    ],
    'about.html': [
      {
        heading: 'Where Najma came from',
        src: 'https://images.pexels.com/photos/3867189/pexels-photo-3867189.jpeg?cs=srgb&fm=jpg',
        alt: 'A group of adults in conversation in an illustrative stock photograph.',
        position: 'center 44%'
      },
      {
        heading: 'A collective shaped by its teachers',
        src: 'https://images.pexels.com/photos/3183186/pexels-photo-3183186.jpeg?cs=srgb&fm=jpg',
        alt: 'A collaborative meeting in an illustrative stock photograph.',
        position: 'center 45%'
      }
    ]
  };

  const pageMedia = media[page] || [];
  const headings = Array.from(document.querySelectorAll('main h2'));

  pageMedia.forEach((item, index) => {
    const heading = headings.find(node => node.textContent.trim() === item.heading);
    const section = heading?.closest('section');
    if (!section || section.querySelector(`[data-editorial-media="${index}"]`)) return;

    const figure = document.createElement('figure');
    figure.className = 'editorial-photo';
    figure.dataset.editorialMedia = String(index);
    figure.style.setProperty('--editorial-photo-position', item.position || 'center');

    const image = document.createElement('img');
    image.src = item.src;
    image.alt = item.alt;
    image.loading = 'lazy';
    image.decoding = 'async';
    image.referrerPolicy = 'no-referrer';

    const caption = document.createElement('figcaption');
    caption.className = 'visually-hidden';
    caption.textContent = 'Illustrative stock photograph from Pexels.';

    figure.append(image, caption);
    section.append(figure);
  });
})();
