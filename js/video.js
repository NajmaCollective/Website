// Silent looping video for heroes and closing bands.
//
// Markup: a media frame holds its poster <img> and, above it, a
// <video data-loop muted loop playsinline preload="none" aria-hidden="true">
// whose <source> elements carry data-src instead of src. Nothing downloads
// until a loop is about to play, and the poster stays in place whenever the
// video can't or shouldn't play.
//
// - A loop plays only while at least half of it is on screen, and only one
//   plays at a time: the one most in view.
// - Nothing plays by itself for visitors who prefer reduced motion, who have
//   turned on data saving, or who are on a 2G or 3G connection. They can
//   still start the loops with the button.
// - Every loop has a visible pause button (WCAG 2.2.2). Pausing or playing one
//   loop applies to all of them and is remembered across pages.
(() => {
  const videos = [...document.querySelectorAll('video[data-loop]')];
  if (!videos.length || !('IntersectionObserver' in window)) return;

  const KEY = 'najma-motion';
  const read = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
  const write = value => { try { localStorage.setItem(KEY, value); } catch { /* storage unavailable: the choice lasts for this page */ } };

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection || {};
  const constrained = () => connection.saveData === true || /(^|-)(2g|3g)$/.test(connection.effectiveType || '');
  // A visitor's own choice wins; otherwise play unless their settings ask us not to.
  const wantsMotion = () => {
    const choice = read();
    if (choice) return choice === 'play';
    return !reduced.matches && !constrained();
  };

  const ratios = new Map(videos.map(video => [video, 0]));
  const buttons = [];

  const load = video => {
    if (video.dataset.loaded) return;
    video.querySelectorAll('source[data-src]').forEach(source => { source.src = source.dataset.src; });
    video.dataset.loaded = 'true';
    video.load();
  };

  const update = () => {
    let best = null;
    if (wantsMotion() && document.visibilityState === 'visible') {
      for (const [video, ratio] of ratios) if (ratio >= .5 && (!best || ratio > ratios.get(best))) best = video;
    }
    for (const video of ratios.keys()) {
      if (video === best) {
        load(video);
        const playing = video.play();
        if (playing) playing.catch(() => { /* autoplay refused: the poster stays */ });
      } else if (!video.paused) {
        video.pause();
      }
    }
    const motion = wantsMotion();
    buttons.forEach(button => {
      button.setAttribute('aria-pressed', String(!motion));
      button.setAttribute('aria-label', motion ? 'Pause background video' : 'Play background video');
      button.querySelector('.material-symbols-outlined').textContent = motion ? 'pause' : 'play_arrow';
    });
  };

  for (const video of videos) {
    // The video fades in over its poster once it is actually playing.
    video.addEventListener('playing', () => video.classList.add('is-playing'), { once: true });
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'loop-toggle';
    button.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">pause</span>';
    button.addEventListener('click', () => { write(wantsMotion() ? 'pause' : 'play'); update(); });
    // In a closing band the artwork is screened onto the green, so the button
    // goes beside the artwork's frame rather than inside it.
    (video.closest('.cta-art') || video).after(button);
    buttons.push(button);

    // If no source can play (the browser tries each in turn and the last one
    // fails too), the poster stays and the button goes.
    const fail = () => {
      ratios.delete(video); video.remove(); button.remove();
      buttons.splice(buttons.indexOf(button), 1);
    };
    video.querySelector('source:last-of-type')?.addEventListener('error', fail);
    video.addEventListener('error', fail);
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => ratios.set(entry.target, entry.intersectionRatio));
    update();
  }, { threshold: [0, .25, .5, .75, 1] });
  videos.forEach(video => observer.observe(video));

  document.addEventListener('visibilitychange', update);
  reduced.addEventListener?.('change', update);
  connection.addEventListener?.('change', update);
  // Another tab changed the choice.
  addEventListener('storage', event => { if (event.key === KEY) update(); });
  update();
})();
