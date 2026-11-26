// DataNusa — router hash dan pengikat halaman.
// Rute: #/ (dasbor), #/indikator, #/indikator/<id>, #/banding,
// #/provinsi, #/sumber, #/tentang.

const view = document.getElementById('view');

function setActiveNav(route) {
  document.querySelectorAll('.nav a').forEach((a) => {
    const href = a.getAttribute('href');
    const on =
      (route === '' && href === '#/') ||
      (route !== '' && href !== '#/' && route.indexOf(href.slice(1)) === 0);
    if (on) a.classList.add('active');
    else a.classList.remove('active');
  });
}

function route() {
  const hash = window.location.hash || '#/';
  const parts = hash.replace(/^#\/?/, '').split('/');
  const page = parts[0] || '';
  const arg = parts[1] || '';
  let html = '';
  let mount = null;
  if (page === '') {
    html = renderDashboard();
    mount = mountDashboard;
  } else if (page === 'indikator' && arg) {
    html = renderIndicator(arg);
    mount = function () {
      mountIndicator(arg);
    };
  } else if (page === 'indikator') {
    html = renderIndicatorsIndex();
  } else if (page === 'banding') {
    html = renderCompare();
    mount = mountCompare;
  } else if (page === 'provinsi') {
    html = renderProvinces();
    mount = mountProvinces;
  } else if (page === 'sumber') {
    html = renderSources();
  } else if (page === 'tentang') {
    html = renderAbout();
  } else {
    html = renderDashboard();
    mount = mountDashboard;
  }
  view.innerHTML = html;
  if (mount) mount();
  setActiveNav(page === '' ? '' : '/' + page);
  window.scrollTo(0, 0);
}

function render() {
  route();
}

window.addEventListener('hashchange', route);

const menuBtn = document.getElementById('menu-btn');
const nav = document.getElementById('main-nav');
if (menuBtn && nav) {
  menuBtn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.addEventListener('click', (event) => {
    if (event.target.tagName === 'A') nav.classList.remove('open');
  });
}

route();
