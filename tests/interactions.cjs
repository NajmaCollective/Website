// DOM-boundary tests using Node's standard library. Visual QA is separate.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
const element = (extra = {}) => ({ listeners: {}, addEventListener(event, fn) { this.listeners[event] = fn; }, ...extra });
function teacherFinder(query) {
  const grid = {}, status = {};
  const areas = ['all', 'general', 'business', 'academic', 'ielts', 'advocacy'].map(area => element({dataset: {area}}));
  const services = ['all', 'short', 'intro'].map(service => element({dataset: {service}}));
  const published = {confirmed: true, id: 'confirmed', name: '<Sample & teacher>', areas: ['general'], services: ['intro'], introduction: 'Verified test fixture', help: '', options: '', teaching: ''};
  let currentUrl;
  const context = { URLSearchParams, URL, location: new URL(`https://example.test/teachers.html${query}`), history: {replaceState(a,b,url) { currentUrl = url; }}, window: {NAJMA_TEACHERS: [published, {...published, id:'draft', confirmed: false}, {...published, id:'unconfirmed', confirmed: undefined}]}, document: {querySelector(s) {return s === '#teacher-grid' ? grid : status;}, querySelectorAll(s) {return s === '[data-area]' ? areas : services;}} };
  vm.runInNewContext(read('js/teachers.js'), context);
  return {grid, status, areas, services, url: () => currentUrl};
}
let finder = teacherFinder('?service=intro');
assert.match(finder.grid.innerHTML, /id="confirmed"/);
assert.doesNotMatch(finder.grid.innerHTML, /id="draft"|id="unconfirmed"/);
assert.match(finder.grid.innerHTML, /&lt;Sample &amp; teacher&gt;/);
assert.equal(finder.services[2].selected, true);
finder.areas[2].listeners.click();
assert.match(finder.grid.innerHTML, /no confirmed profiles for this combination/);
assert.equal(finder.url().searchParams.get('service'), 'intro');
assert.equal(finder.url().searchParams.get('area'), 'business');
finder = teacherFinder('?area=invalid&service=unknown');
assert.equal(finder.areas[0].selected, true);
assert.equal(finder.services[0].selected, true);
finder = teacherFinder('?service=short');
assert.match(finder.grid.innerHTML, /25-minute lesson at £10/);
finder.services[0].listeners.click();
assert.equal(finder.url().searchParams.has('service'), false);

(async () => {
  const prev = element(), next = element(), status = {};
  const controls = {hidden: true, querySelector(s) {return s === '[data-carousel-prev]' ? prev : s === '[data-carousel-next]' ? next : status;}};
  let movement;
  const carousel = element({children: [{offsetLeft: 0}, {offsetLeft: 300}, {offsetLeft: 600}], clientWidth: 400, scrollWidth: 880, scrollLeft: 0,
    scrollBy(o) {movement = o;}, scrollTo(o) {movement = o;}});
  const menu = {open: true, contains: () => false, querySelector: () => ({focus() {menu.focused = true;}})};
  const document = element({querySelector(s) { return s === '.mobile-nav' ? menu : s === '.lesson-carousel' ? carousel : controls; }, querySelectorAll() {return [];}});
  vm.runInNewContext(read('js/utils.js'), {document, matchMedia: () => ({matches: true}), customElements: {whenDefined: () => Promise.resolve()}, ResizeObserver: class {observe() {}}});
  await Promise.resolve();
  assert.equal(controls.hidden, false);
  assert.equal(prev.disabled, true);
  assert.equal(next.disabled, false);
  next.listeners.click();
  assert.equal(movement.left, 300);
  assert.equal(movement.behavior, 'instant');
  carousel.scrollLeft = 480; carousel.listeners.scroll();
  assert.equal(next.disabled, true);
  let prevented = false;
  carousel.listeners.keydown({target: carousel, key: 'Home', preventDefault() {prevented = true;}});
  assert.equal(movement.left, 0); assert.equal(prevented, true);
  document.listeners.keydown({key: 'Escape'});
  assert.equal(menu.open, false); assert.equal(menu.focused, true);
  console.log('PASS: confirmed profiles, combined filters, URL state, HTML escaping, carousel boundaries, reduced motion, keyboard movement and menu dismissal.');
})().catch(error => {console.error(error); process.exitCode = 1;});
